"use client";

import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import CustomLabel from "@/components/custom-label";
import { cn } from "@/lib";
import { RHF_ERROR_TEXT_CLASS } from "../rhf.data";
import { IRHFFieldProps } from "./rhf-field.interface";

// What every field shares: the form binding, a unique id, the label and the
// error line. The control itself is drawn by `children`.
export default function RHFField(props: IRHFFieldProps) {
  const {
    name,
    label,
    required,
    labelClassName,
    wrapperClassName,
    disabled,
    children,
  } = props;

  const { control } = useFormContext();
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("relative min-w-0", wrapperClassName)}>
          {label && (
            <CustomLabel
              htmlFor={id}
              label={label}
              required={required}
              className={labelClassName}
            />
          )}
          {children({
            field,
            hasError: !!error,
            controlProps: {
              id,
              value: field.value ?? "",
              "aria-required": required,
              "aria-invalid": !!error,
              // Only point at the error line when there is one to point at.
              "aria-describedby": error?.message ? errorId : undefined,
            },
          })}
          {error?.message && (
            <p id={errorId} role="alert" className={RHF_ERROR_TEXT_CLASS}>
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
