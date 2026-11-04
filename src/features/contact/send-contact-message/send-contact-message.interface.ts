export type TContactFormKind = "say-hello" | "get-a-quote";

export interface ISendContactMessageInput {
  form: TContactFormKind;
  // Untrusted: re-validated on the server before anything is sent.
  values: unknown;
}

// What the form is told. A failure carries no detail: the visitor only needs
// to know to try again.
export type TSendContactMessageResult = { ok: true } | { ok: false };
