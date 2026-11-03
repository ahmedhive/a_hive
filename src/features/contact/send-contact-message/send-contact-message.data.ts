// The address mail is sent from, on the domain verified in Resend. Nothing
// reads replies sent to it; the visitor's own address is set as the reply-to
// instead.
export const CONTACT_FROM = "Ahmed Hive <noreply@mail.ahmedhive.com>";

// How long a send to Resend may take before it counts as failed, so a slow
// service shows the visitor the error instead of leaving "Sending..." up.
export const SEND_TIMEOUT_MS = 10000;

export const CONTACT_SUBJECTS = {
  "say-hello": "New message from",
  "get-a-quote": "New quote request from",
};

// The label shown next to each value in the email, in the order shown.
export const CONTACT_EMAIL_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "company", label: "Company" },
  { key: "projectType", label: "Project type" },
  { key: "budget", label: "Budget" },
  { key: "message", label: "Message" },
] as const;

// The confirmation the visitor gets back, from the same noreply address with
// replies pointed at the real inbox. It is fixed text on purpose: it goes to
// whatever address was typed into the form, so nothing the visitor wrote (name
// or message) is repeated in it, or the form could be used to send someone
// else's words, in my name, to a stranger.
export const CONFIRMATION_SUBJECT = "Thanks for getting in touch";
export const CONFIRMATION_GREETING = "Hi there,";
export const CONFIRMATION_BODY =
  "Thanks for your message. I've received it and will get back to you soon.";
export const CONFIRMATION_SIGNATURE = "Ahmed Hive";
