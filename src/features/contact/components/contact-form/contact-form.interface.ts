import { ReactNode } from "react";
import { DefaultValues, FieldValues } from "react-hook-form";
import { z } from "zod";
import { TSendContactMessageResult } from "../../send-contact-message/send-contact-message.interface";

export interface IContactFormProps<TValues extends FieldValues> {
  schema: z.ZodType<TValues, TValues>;
  defaultValues: DefaultValues<TValues>;
  // Sends the validated values; the form shows the outcome.
  send: (values: TValues) => Promise<TSendContactMessageResult>;
  // Extra fields, shown between the company and message fields.
  children?: ReactNode;
}

export type TContactFormStatus = "idle" | "success" | "error";
