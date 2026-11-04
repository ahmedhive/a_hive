import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  IContactFormProps,
  TContactFormStatus,
} from "./contact-form.interface";

export default function useContactForm<TValues extends FieldValues>(
  props: Pick<IContactFormProps<TValues>, "schema" | "defaultValues" | "send">,
) {
  const { schema, defaultValues, send } = props;
  const [status, setStatus] = useState<TContactFormStatus>("idle");
  // A Turnstile pass works once, so each send ends with a fresh widget.
  const [challengeKey, setChallengeKey] = useState(0);

  const methods = useForm<TValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // The form clears only once the message has really gone, so a failed send
  // keeps what the visitor typed. handleSubmit waits on this, so
  // formState.isSubmitting covers the whole send.
  const onSubmit = methods.handleSubmit(async (values) => {
    setStatus("idle");
    try {
      const result = await send(values);
      if (result.ok) {
        methods.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setChallengeKey((key) => key + 1);
    }
  });

  return { methods, onSubmit, status, challengeKey };
}
