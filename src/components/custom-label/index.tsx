"use client";

import { cn } from "@/lib";
import { ICustomLabelProps } from "./custom-label.interface";

export default function CustomLabel(props: ICustomLabelProps) {
  const { htmlFor, label, required, className } = props;

  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-2 block text-base leading-6 font-bold text-black-secondary uppercase",
        className,
      )}
    >
      {label}
      {/* The control carries aria-required, so the mark is visual only. */}
      {required && <span aria-hidden>*</span>}
    </label>
  );
}
