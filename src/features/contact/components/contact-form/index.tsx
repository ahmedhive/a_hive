"use client";

import { FieldValues } from "react-hook-form";
import { CustomButton } from "@/components";
import {
  FormProvider,
  RHFTextarea,
  RHFTextField,
} from "@/components/react-hook-form";
import {
  CONTACT_FIELD_LABELS,
  CONTACT_FIELD_PLACEHOLDERS,
  CONTACT_FIELDS_CLASS,
  CONTACT_FORM_CLASS,
  CONTACT_MESSAGE_CLASS,
  CONTACT_SUBMIT_LABEL,
} from "./contact-form.data";
import { IContactFormProps } from "./contact-form.interface";
import useContactForm from "./use-contact-form";

export default function ContactForm<TValues extends FieldValues>(
  props: IContactFormProps<TValues>,
) {
  const { children } = props;
  const { methods, onSubmit } = useContactForm(props);

  return (
    <FormProvider
      methods={methods}
      onSubmit={onSubmit}
      className={CONTACT_FORM_CLASS}
    >
      <div className={CONTACT_FIELDS_CLASS}>
        <RHFTextField
          name="name"
          label={CONTACT_FIELD_LABELS.name}
          placeholder={CONTACT_FIELD_PLACEHOLDERS.name}
          autoComplete="name"
          required
        />
        <RHFTextField
          name="email"
          type="email"
          label={CONTACT_FIELD_LABELS.email}
          placeholder={CONTACT_FIELD_PLACEHOLDERS.email}
          autoComplete="email"
          required
        />
        <RHFTextField
          name="phone"
          type="tel"
          label={CONTACT_FIELD_LABELS.phone}
          placeholder={CONTACT_FIELD_PLACEHOLDERS.phone}
          autoComplete="tel"
        />
        <RHFTextField
          name="company"
          label={CONTACT_FIELD_LABELS.company}
          placeholder={CONTACT_FIELD_PLACEHOLDERS.company}
          autoComplete="organization"
        />
        {children}
        <RHFTextarea
          name="message"
          label={CONTACT_FIELD_LABELS.message}
          placeholder={CONTACT_FIELD_PLACEHOLDERS.message}
          wrapperClassName={CONTACT_MESSAGE_CLASS}
          required
        />
      </div>
      <CustomButton type="submit" label={CONTACT_SUBMIT_LABEL} />
    </FormProvider>
  );
}
