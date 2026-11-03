"use client";

import { SelectArrowIcon } from "@/assets/icons";
import { cn } from "@/lib";
import RHFField from "../rhf-field";
import {
  RHF_FIELD_CLASS,
  RHF_FIELD_ERROR_CLASS,
  RHF_SELECT_ARROW_CLASS,
  RHF_SELECT_CLASS,
} from "../rhf.data";
import { splitFieldProps } from "../rhf.utils";
import { IRHFSelectProps } from "./rhf-select.interface";

export default function RHFSelect(props: IRHFSelectProps) {
  const { fieldProps, rest } = splitFieldProps(props);
  const { options, placeholder, className, ...other } = rest;

  return (
    <RHFField {...fieldProps}>
      {({ field, controlProps, hasError }) => {
        // A value that matches no option (an unset field) would otherwise
        // show the first option while the form holds nothing.
        const showEmptyOption =
          placeholder !== undefined ||
          !options.some(({ value }) => value === controlProps.value);

        return (
          // The arrow is drawn over a native select, which keeps its keyboard
          // and mobile pickers.
          <div className="relative">
            <select
              {...other}
              {...field}
              {...controlProps}
              className={cn(
                RHF_FIELD_CLASS,
                RHF_SELECT_CLASS,
                hasError && RHF_FIELD_ERROR_CLASS,
                className,
              )}
            >
              {showEmptyOption && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <SelectArrowIcon aria-hidden className={RHF_SELECT_ARROW_CLASS} />
          </div>
        );
      }}
    </RHFField>
  );
}
