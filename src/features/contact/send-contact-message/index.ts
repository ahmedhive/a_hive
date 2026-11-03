"use server";

import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/constants";
import {
  HONEYPOT_FIELD,
  TURNSTILE_TOKEN_FIELD,
} from "../components/contact-form/contact-form.fields";
import { contactBaseSchema } from "../components/contact-form/contact-form.schema";
import { quoteSchema } from "../components/contact-form/components/quote-form/quote-form.schema";
import {
  // CONFIRMATION_SUBJECT, // confirmation
  CONTACT_FROM,
  SEND_TIMEOUT_MS,
} from "./send-contact-message.data";
import {
  ISendContactMessageInput,
  TSendContactMessageResult,
} from "./send-contact-message.interface";
import {
  // buildConfirmationHtml, // confirmation
  // buildConfirmationText, // confirmation
  buildHtml,
  buildSubject,
  buildText,
} from "./send-contact-message.utils";
import { verifyTurnstile } from "./verify-turnstile";

const SCHEMAS = {
  "say-hello": contactBaseSchema,
  "get-a-quote": quoteSchema,
};

// A server action is a public endpoint: anyone can POST to it without using
// the form, so the values are validated again here.
export async function sendContactMessage(
  input: ISendContactMessageInput,
): Promise<TSendContactMessageResult> {
  // The form kind is untrusted, so only the schemas' own keys count: a name
  // like "constructor" must not resolve to something inherited.
  if (!Object.hasOwn(SCHEMAS, input.form)) return { ok: false };
  const schema = SCHEMAS[input.form];

  const parsed = schema.safeParse(input.values);
  if (!parsed.success) return { ok: false };
  const values = parsed.data;

  // The honeypot field is hidden from people, so only a bot fills it. It is
  // told the message went through, so it has nothing to adapt to.
  if (values[HONEYPOT_FIELD] !== "") return { ok: true };

  // Only a real pass of the Cloudflare challenge gets this far.
  if (!(await verifyTurnstile(values[TURNSTILE_TOKEN_FIELD]))) {
    return { ok: false };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; contact message not sent.");
    return { ok: false };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(
    {
      from: CONTACT_FROM,
      to: CONTACT_EMAIL,
      replyTo: values.email,
      subject: buildSubject(input.form, values.name),
      text: buildText(values),
      html: buildHtml(values),
    },
    { signal: AbortSignal.timeout(SEND_TIMEOUT_MS) },
  );

  if (error) {
    console.error("Resend rejected the contact message:", error);
    return { ok: false };
  }

  // The visitor confirmation email is switched off for now: it doubles the
  // emails per submission, halving the free plan's 100 emails/day (100
  // submissions/day without it, 50 with it). To bring it back, uncomment this
  // block and the three imports marked "confirmation" above.
  //
  // The message has reached me, so the visitor's confirmation is a courtesy:
  // if it fails, the send still counts as done.
  // const { error: confirmationError } = await resend.emails.send(
  //   {
  //     from: CONTACT_FROM,
  //     to: values.email,
  //     replyTo: CONTACT_EMAIL,
  //     subject: CONFIRMATION_SUBJECT,
  //     text: buildConfirmationText(),
  //     html: buildConfirmationHtml(),
  //   },
  //   { signal: AbortSignal.timeout(SEND_TIMEOUT_MS) },
  // );
  // if (confirmationError) {
  //   console.error("Resend rejected the confirmation:", confirmationError);
  // }

  return { ok: true };
}
