import { z } from "zod";
import { contactBaseSchema } from "../../contact-form.schema";
import {
  QUOTE_BUDGETS,
  QUOTE_OTHER_MAX_LENGTH,
  QUOTE_OTHER_PROJECT_TYPE,
  QUOTE_PROJECT_TYPES,
} from "./quote-form.data";

export const quoteSchema = contactBaseSchema
  .extend({
    projectType: z.enum(QUOTE_PROJECT_TYPES, {
      error: "Select a project type",
    }),
    budget: z.enum(QUOTE_BUDGETS, { error: "Select a budget" }),
    projectTypeOther: z
      .string()
      .trim()
      .max(
        QUOTE_OTHER_MAX_LENGTH,
        `Must be ${QUOTE_OTHER_MAX_LENGTH} characters or less`,
      ),
  })
  // Required only when "Other" is chosen. `when` keeps the check running while
  // the selects still have errors, so all the errors show on one submit.
  .refine(
    (values) =>
      values.projectType !== QUOTE_OTHER_PROJECT_TYPE ||
      values.projectTypeOther !== "",
    {
      path: ["projectTypeOther"],
      error: "Tell us what kind of project this is",
      when: () => true,
    },
  )
  // Text typed before switching away from "Other" must not be sent.
  .transform((values) =>
    values.projectType === QUOTE_OTHER_PROJECT_TYPE
      ? values
      : { ...values, projectTypeOther: "" },
  );

export type TQuoteValues = z.infer<typeof quoteSchema>;
