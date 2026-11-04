import { FormEventHandler, ReactNode } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export interface IFormProviderProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  children: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  methods: UseFormReturn<TFieldValues>;
  className?: string;
}
