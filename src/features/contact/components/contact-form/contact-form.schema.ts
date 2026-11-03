import { z } from "zod";
import { HONEYPOT_FIELD, TURNSTILE_TOKEN_FIELD } from "./contact-form.fields";

// Digits with an optional leading + and the usual separators, 6 to 20 long.
const PHONE_PATTERN = /^[+()\d][\d\s().-]{5,19}$/;

// The fields both forms share. Optional text fields stay strings (empty when
// untouched) so every input is controlled from the start.
export const contactBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(56, "Name must be 56 characters or less"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || PHONE_PATTERN.test(value),
      "Enter a valid phone number",
    ),
  company: z.string().trim().max(80, "Company must be 80 characters or less"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message must be 5000 characters or less"),
  [HONEYPOT_FIELD]: z.string().max(200),
  [TURNSTILE_TOKEN_FIELD]: z
    .string()
    .min(1, "Please wait for the spam check to finish"),
});
