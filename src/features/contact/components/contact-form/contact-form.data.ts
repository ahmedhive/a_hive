import { HONEYPOT_FIELD, TURNSTILE_TOKEN_FIELD } from "./contact-form.fields";

export const CONTACT_SUBMIT_LABEL = "Send Message";
export const CONTACT_SENDING_LABEL = "Sending...";

// The outcome line under the button, worded like the reference's own.
export const CONTACT_SUCCESS_MESSAGE =
  "Thank you! Your message has been received.";
export const CONTACT_ERROR_MESSAGE =
  "Oops! Something went wrong while sending your message. Please try again.";
export const CONTACT_STATUS_CLASS = "mt-6 text-center text-base lg:text-xl";
export const CONTACT_STATUS_ERROR_CLASS = "text-vivid-red";

// The honeypot field: kept out of sight and out of the tab order and screen
// readers, so only a bot that fills every input ever touches it.
export const CONTACT_HONEYPOT_LABEL = "Website";
export const CONTACT_HONEYPOT_CLASS =
  "absolute -left-[9999px] size-px overflow-hidden";

// The grid the fields sit in: one column below `sm`, two from `sm`, with the
// message across both. Gaps and the space above the button follow the
// reference (20px, 32px from `lg`; 32 / 48 / 60px to the button).
export const CONTACT_FORM_CLASS = "flex flex-col items-center";
export const CONTACT_FIELDS_CLASS =
  "mb-8 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:mb-12 lg:mb-15 lg:gap-8";
export const CONTACT_MESSAGE_CLASS = "sm:col-span-2";

export const CONTACT_FIELD_LABELS = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  message: "Message",
};

export const CONTACT_FIELD_PLACEHOLDERS = {
  name: "Your name",
  email: "Your email",
  phone: "Phone number",
  company: "Company name",
  message: "Write your thoughts",
};

// The fields both forms share, all empty.
export const CONTACT_BASE_DEFAULT_VALUES = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
  [HONEYPOT_FIELD]: "",
  [TURNSTILE_TOKEN_FIELD]: "",
};
