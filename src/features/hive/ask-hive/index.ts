import { NextResponse } from "next/server";
import { z } from "zod";
import { MAX_QUESTION_LENGTH } from "../hive.data";
import { THiveStreamEvent } from "../hive.interface";
import { SYSTEM_PROMPT } from "./ask-hive.context";
import { generateText } from "./ask-hive.gemini";
import { guardRequest } from "./ask-hive.guard";
import { streamSpeech } from "./ask-hive.speech";

const MAX_TURNS = 8;
const SPEECH_TIMEOUT_MS = 45_000;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        text: z.string().min(1).max(MAX_QUESTION_LENGTH),
      }),
    )
    .min(1)
    .max(MAX_TURNS)
    .refine((m) => m.at(-1)?.role === "user"),
  // Speech is made here from Hive's own reply and never from client text,
  // so this route can't be used as a free text-to-speech service.
  speak: z.boolean().optional(),
});

// History turns are capped at MAX_QUESTION_LENGTH, so a reply must fit too.
function capReply(text: string) {
  if (text.length <= MAX_QUESTION_LENGTH) return text;
  const sentences = text
    .slice(0, MAX_QUESTION_LENGTH + 1)
    .match(/^[\s\S]*[.!?](?=\s)/);
  if (sentences && sentences[0].length >= MAX_QUESTION_LENGTH / 2)
    return sentences[0];
  const clipped = text.slice(0, MAX_QUESTION_LENGTH - 3);
  const space = clipped.lastIndexOf(" ");
  return `${(space > 0 ? clipped.slice(0, space) : clipped).trimEnd()}...`;
}

export default async function askHive(request: Request) {
  const guard = guardRequest(request, "application/json", "ask");
  if ("rejected" in guard) return guard.rejected;
  const { key } = guard;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const generated = await generateText(key, {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: parsed.data.messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
    generationConfig: { maxOutputTokens: 250, temperature: 0.5 },
  });
  if ("error" in generated) {
    return NextResponse.json(
      { error: generated.error },
      { status: generated.status },
    );
  }
  const reply = capReply(generated.text);
  // One JSON event per line: the reply, then audio as it's generated.
  const speak = parsed.data.speak === true;
  const abort = new AbortController();
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: THiveStreamEvent) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      try {
        send({ t: "reply", text: reply });
        let audio = false;
        if (speak) {
          const signal = AbortSignal.any([
            abort.signal,
            request.signal,
            AbortSignal.timeout(SPEECH_TIMEOUT_MS),
          ]);
          for await (const event of streamSpeech(reply, key, signal)) {
            audio = true;
            send(event);
          }
        }
        send({ t: "end", audio });
        controller.close();
      } catch {
        // The visitor stopped the reply or left.
        abort.abort();
        try {
          controller.close();
        } catch {
          // Already closed.
        }
      }
    },
    cancel() {
      abort.abort();
    },
  });
  return new Response(body, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      // no-transform keeps compression from holding audio back.
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
