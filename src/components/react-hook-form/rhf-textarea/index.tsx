"use client";

import { cn } from "@/lib";
import RHFField from "../rhf-field";
import {
  RHF_FIELD_CLASS,
  RHF_FIELD_ERROR_CLASS,
  RHF_TEXTAREA_CLASS,
} from "../rhf.data";
import { splitFieldProps } from "../rhf.utils";
import { IRHFTextareaProps } from "./rhf-textarea.interface";

export default function RHFTextarea(props: IRHFTextareaProps) {
  const { fieldProps, rest } = splitFieldProps(props);
  const { className, ...other } = rest;

  return (
    <RHFField {...fieldProps}>
      {({ field, controlProps, hasError }) => (
        <textarea
          {...other}
          {...field}
          {...controlProps}
          className={cn(
            RHF_FIELD_CLASS,
            RHF_TEXTAREA_CLASS,
            hasError && RHF_FIELD_ERROR_CLASS,
            className,
          )}
        />
      )}
    </RHFField>
  );
}
