"use client";

import { useWatch } from "react-hook-form";
import { RHFTextField } from "@/components/react-hook-form";
import {
  QUOTE_OTHER_LABEL,
  QUOTE_OTHER_MAX_LENGTH,
  QUOTE_OTHER_PLACEHOLDER,
  QUOTE_OTHER_PROJECT_TYPE,
} from "../../quote-form.data";

// Shown across both columns once "Other" is picked as the project type.
export default function OtherProjectTypeField() {
  const projectType = useWatch({ name: "projectType" });
  if (projectType !== QUOTE_OTHER_PROJECT_TYPE) return null;

  return (
    <RHFTextField
      name="projectTypeOther"
      label={QUOTE_OTHER_LABEL}
      placeholder={QUOTE_OTHER_PLACEHOLDER}
      maxLength={QUOTE_OTHER_MAX_LENGTH}
      wrapperClassName="sm:col-span-2"
      required
    />
  );
}
