import { ReactNode } from "react";
import { DefaultValues, FieldValues } from "react-hook-form";
import { z } from "zod";

export interface IContactFormProps<TValues extends FieldValues> {
  schema: z.ZodType<TValues, TValues>;
  defaultValues: DefaultValues<TValues>;
  // Extra fields, shown between the company and message fields.
  children?: ReactNode;
}
