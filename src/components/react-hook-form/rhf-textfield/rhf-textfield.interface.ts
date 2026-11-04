import { InputHTMLAttributes } from "react";
import { IRHFFieldOwnProps } from "../rhf-field/rhf-field.interface";

export interface IRHFTextFieldProps
  extends
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "name" | "value" | "defaultValue" | "onChange" | "onBlur"
    >,
    IRHFFieldOwnProps {}
