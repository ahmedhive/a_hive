"use client";

import { cn } from "@/lib";
import RHFField from "../rhf-field";
import {
  RHF_FIELD_CLASS,
  RHF_FIELD_ERROR_CLASS,
  RHF_INPUT_CLASS,
} from "../rhf.data";
import { splitFieldProps } from "../rhf.utils";
import { IRHFTextFieldProps } from "./rhf-textfield.interface";

export default function RHFTextField(props: IRHFTextFieldProps) {
  const { fieldProps, rest } = splitFieldProps(props);
  const { className, type = "text", ...other } = rest;

  return (
    <RHFField {...fieldProps}>
      {({ field, controlProps, hasError }) => (
        <input
          {...other}
          {...field}
          {...controlProps}
          type={type}
          className={cn(
            RHF_FIELD_CLASS,
            RHF_INPUT_CLASS,
            hasError && RHF_FIELD_ERROR_CLASS,
            className,
          )}
        />
      )}
    </RHFField>
  );
}
