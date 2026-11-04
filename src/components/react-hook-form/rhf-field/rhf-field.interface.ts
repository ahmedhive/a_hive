import { ReactNode } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

// What every control needs from its field, beyond react-hook-form's own
// `field` props: its id, current value and the aria links to its error.
export interface IRHFControlProps {
  id: string;
  value: string;
  "aria-required"?: boolean;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
}

export interface IRHFFieldRenderArgs {
  field: ControllerRenderProps<FieldValues, string>;
  controlProps: IRHFControlProps;
  hasError: boolean;
}

export interface IRHFFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  labelClassName?: string;
  // Sizes the whole field (label, control and error), e.g. to span grid columns.
  wrapperClassName?: string;
  // Disabled fields are skipped by react-hook-form's submit, not only greyed.
  disabled?: boolean;
  children: (args: IRHFFieldRenderArgs) => ReactNode;
}

// The props every field component takes for its RHFField; the rest go to the
// native control.
export type IRHFFieldOwnProps = Omit<IRHFFieldProps, "children">;
