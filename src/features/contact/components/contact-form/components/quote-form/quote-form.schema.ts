import { z } from "zod";
import { contactBaseSchema } from "../../contact-form.schema";
import { QUOTE_BUDGETS, QUOTE_PROJECT_TYPES } from "./quote-form.data";

export const quoteSchema = contactBaseSchema.extend({
  projectType: z.enum(QUOTE_PROJECT_TYPES, { error: "Select a project type" }),
  budget: z.enum(QUOTE_BUDGETS, { error: "Select a budget" }),
});

export type TQuoteValues = z.infer<typeof quoteSchema>;
