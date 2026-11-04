import {
  CONFIRMATION_BODY,
  CONFIRMATION_GREETING,
  CONFIRMATION_SIGNATURE,
  CONTACT_EMAIL_FIELDS,
  CONTACT_SUBJECTS,
} from "./send-contact-message.data";
import { TContactFormKind } from "./send-contact-message.interface";

// Visitors type this text, so it is escaped before it goes into the email's
// HTML.
const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

// A name or subject can't carry a line break, or it could add mail headers.
const toSingleLine = (value: string) => value.replace(/\s+/g, " ").trim();

export const buildSubject = (form: TContactFormKind, name: string) =>
  `${CONTACT_SUBJECTS[form]} ${toSingleLine(name)}`;

// Only the fields that were filled in, so a quote's project type and budget
// appear and an empty phone or company doesn't.
const toRows = (values: Record<string, unknown>) =>
  CONTACT_EMAIL_FIELDS.flatMap(({ key, label }) => {
    const value = values[key];
    return typeof value === "string" && value !== "" ? [{ label, value }] : [];
  });

export const buildText = (values: Record<string, unknown>) =>
  toRows(values)
    .map(({ label, value }) => `${label}: ${value}`)
    .join("\n");

export const buildHtml = (values: Record<string, unknown>) =>
  `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:15px">${toRows(
    values,
  )
    .map(
      ({ label, value }) =>
        `<tr><td style="vertical-align:top;font-weight:bold">${escapeHtml(label)}</td><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>`;

export const buildConfirmationText = () =>
  [CONFIRMATION_GREETING, CONFIRMATION_BODY, CONFIRMATION_SIGNATURE].join(
    "\n\n",
  );

export const buildConfirmationHtml = () =>
  `<div style="font-family:sans-serif;font-size:15px;line-height:1.5"><p>${escapeHtml(CONFIRMATION_GREETING)}</p><p>${escapeHtml(CONFIRMATION_BODY)}</p><p>${escapeHtml(CONFIRMATION_SIGNATURE)}</p></div>`;
