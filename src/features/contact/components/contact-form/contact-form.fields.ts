// Names of the two form values that are not typed by the visitor, each used by
// the schema, the form and the server action.

// A honeypot: hidden from people, so a value here means a bot filled the form
// in. Its name is deliberately unlike anything a browser autofills (website,
// url, nickname, email...), so a real visitor never fills it by accident and
// loses their message.
export const HONEYPOT_FIELD = "contactReference";

// The pass from the Cloudflare Turnstile check, which the server verifies.
export const TURNSTILE_TOKEN_FIELD = "turnstileToken";
