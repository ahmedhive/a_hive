"use client";

import { FieldValues, FormProvider as RHFFormProvider } from "react-hook-form";
import { cn } from "@/lib";
import { IFormProviderProps } from "./form-provider.interface";

export default function FormProvider<
  TFieldValues extends FieldValues = FieldValues,
>(props: IFormProviderProps<TFieldValues>) {
  const { children, onSubmit, methods, className } = props;

  return (
    <RHFFormProvider {...methods}>
      {/* noValidate: the browser's own validation bubbles would fight the
          field errors react-hook-form renders. */}
      <form noValidate onSubmit={onSubmit} className={cn("min-w-0", className)}>
        {children}
      </form>
    </RHFFormProvider>
  );
}
