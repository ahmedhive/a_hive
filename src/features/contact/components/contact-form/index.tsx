"use client";

import { FieldValues } from "react-hook-form";
import { CustomButton } from "@/components";
import {
  FormProvider,
  RHFTextarea,
  RHFTextField,
} from "@/components/react-hook-form";
import { cn } from "@/lib";
import {
  CONTACT_ERROR_MESSAGE,
  CONTACT_FIELD_LABELS,
  CONTACT_FIELD_PLACEHOLDERS,
  CONTACT_FIELDS_CLASS,
  CONTACT_FORM_CLASS,
  CONTACT_HONEYPOT_CLASS,
  CONTACT_HONEYPOT_LABEL,
  CONTACT_MESSAGE_CLASS,
  CONTACT_SENDING_LABEL,
  CONTACT_STATUS_CLASS,
  CONTACT_STATUS_ERROR_CLASS,
  CONTACT_SUBMIT_LABEL,
  CONTACT_SUCCESS_MESSAGE,
} from "./contact-form.data";
import { IContactFormProps } from "./contact-form.interface";
import TurnstileField from "./components/turnstile-field";
import { HONEYPOT_FIELD } from "./contact-form.fields";
import useContactForm from "./use-contact-form";

export default function ContactForm<TValues extends FieldValues>(
  props: IContactFormProps<TValues>,
) {
  const { children } = props;
  const { methods, onSubmit, status, challengeKey } = useContactForm(props);
  const { isSubmitting } = methods.formState;

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
        <div aria-hidden className={CONTACT_HONEYPOT_CLASS}>
          <RHFTextField
            name={HONEYPOT_FIELD}
            label={CONTACT_HONEYPOT_LABEL}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>
      <TurnstileField key={challengeKey} />
      <CustomButton
        type="submit"
        label={isSubmitting ? CONTACT_SENDING_LABEL : CONTACT_SUBMIT_LABEL}
        disabled={isSubmitting}
      />
      {status === "success" && (
        <p role="status" className={CONTACT_STATUS_CLASS}>
          {CONTACT_SUCCESS_MESSAGE}
        </p>
      )}
      {status === "error" && (
        <p
          role="alert"
          className={cn(CONTACT_STATUS_CLASS, CONTACT_STATUS_ERROR_CLASS)}
        >
          {CONTACT_ERROR_MESSAGE}
        </p>
      )}
    </FormProvider>
  );
}
