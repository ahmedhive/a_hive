import { SelectHTMLAttributes } from "react";
import { IRHFFieldOwnProps } from "../rhf-field/rhf-field.interface";

export interface IRHFSelectOption {
  label: string;
  value: string;
}

export interface IRHFSelectProps
  extends
    Omit<
      SelectHTMLAttributes<HTMLSelectElement>,
      "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "children"
    >,
    IRHFFieldOwnProps {
  options: IRHFSelectOption[];
  // Shown, unselectable, until a value is chosen. Without one the select still
  // shows a blank, unselectable entry while the form value matches no option,
  // so what it shows is always what the form holds.
  placeholder?: string;
}
