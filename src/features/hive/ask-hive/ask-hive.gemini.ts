// Free-tier friendly, tried in order: a busy or retired model falls through
// to the next. GEMINI_MODEL, if set, goes first.
const MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
].filter((m): m is string => !!m);
export const geminiUrl = (model: string, method: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:${method}`;
export const geminiHeaders = (key: string) => ({
  "Content-Type": "application/json",
  "x-goog-api-key": key,
});
const TIMEOUT_MS = 15_000;

type TGenerated =
  { text: string } | { error: "busy" | "upstream" | "empty"; status: number };

export async function generateText(
  key: string,
  payload: object,
): Promise<TGenerated> {
  let upstream: Response | null = null;
  for (const model of MODELS) {
    upstream = await fetch(geminiUrl(model, "generateContent"), {
      method: "POST",
      headers: geminiHeaders(key),
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }).catch(() => null);
    if (upstream?.ok) break;
    // Only its status is used, so the connection can be released.
    void upstream?.body?.cancel().catch(() => {});
  }

  if (!upstream) return { error: "upstream", status: 502 };
  if (upstream.status === 429 || upstream.status === 503) {
    return { error: "busy", status: 429 };
  }
  if (!upstream.ok) return { error: "upstream", status: 502 };

  const data = (await upstream.json().catch(() => null)) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  } | null;
  if (!data) return { error: "upstream", status: 502 };
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();
  return text ? { text } : { error: "empty", status: 502 };
}
