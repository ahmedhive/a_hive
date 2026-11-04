import { TextareaHTMLAttributes } from "react";
import { IRHFFieldOwnProps } from "../rhf-field/rhf-field.interface";

export interface IRHFTextareaProps
  extends
    Omit<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      "name" | "value" | "defaultValue" | "onChange" | "onBlur"
    >,
    IRHFFieldOwnProps {}
