"use client";

import { RHFSelect } from "@/components/react-hook-form";
import { sendContactMessage } from "../../../../send-contact-message";
import ContactForm from "../..";
import {
  QUOTE_BUDGET_LABEL,
  QUOTE_BUDGET_OPTIONS,
  QUOTE_DEFAULT_VALUES,
  QUOTE_PROJECT_TYPE_LABEL,
  QUOTE_PROJECT_TYPE_OPTIONS,
  QUOTE_SELECT_PLACEHOLDER,
} from "./quote-form.data";
import { quoteSchema, TQuoteValues } from "./quote-form.schema";

export default function QuoteForm() {
  return (
    <ContactForm<TQuoteValues>
      schema={quoteSchema}
      // The selects start empty, which is not one of their allowed values yet.
      defaultValues={QUOTE_DEFAULT_VALUES as TQuoteValues}
      send={(values) => sendContactMessage({ form: "get-a-quote", values })}
    >
      <RHFSelect
        name="projectType"
        label={QUOTE_PROJECT_TYPE_LABEL}
        options={QUOTE_PROJECT_TYPE_OPTIONS}
        placeholder={QUOTE_SELECT_PLACEHOLDER}
        required
      />
      <RHFSelect
        name="budget"
        label={QUOTE_BUDGET_LABEL}
        options={QUOTE_BUDGET_OPTIONS}
        placeholder={QUOTE_SELECT_PLACEHOLDER}
        required
      />
    </ContactForm>
  );
}
