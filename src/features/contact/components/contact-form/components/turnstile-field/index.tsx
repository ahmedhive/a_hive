"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib";
import { RHF_ERROR_TEXT_CLASS } from "@/components/react-hook-form/rhf.data";
import { TURNSTILE_TOKEN_FIELD } from "../../contact-form.fields";
import {
  TURNSTILE_ACTIVE_CLASS,
  TURNSTILE_CLASS,
  TURNSTILE_OPTIONS,
  TURNSTILE_UNAVAILABLE_MESSAGE,
} from "./turnstile-field.data";

// Cloudflare Turnstile, bound to the form: a pass fills the token field, and
// an expiry or error empties it again. A token works once, so the form mounts
// a fresh widget (a new `key`) after every send.
export default function TurnstileField() {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    setValue(TURNSTILE_TOKEN_FIELD, "");
  }, [setValue]);

  const setToken = (token: string) =>
    setValue(TURNSTILE_TOKEN_FIELD, token, { shouldValidate: true });

  const message = errors[TURNSTILE_TOKEN_FIELD]?.message;

  return (
    <div className={cn(TURNSTILE_CLASS, asking && TURNSTILE_ACTIVE_CLASS)}>
      {siteKey ? (
        <Turnstile
          siteKey={siteKey}
          options={TURNSTILE_OPTIONS}
          onBeforeInteractive={() => setAsking(true)}
          onAfterInteractive={() => setAsking(false)}
          onSuccess={setToken}
          onExpire={() => setToken("")}
          onError={() => setToken("")}
        />
      ) : (
        <p role="alert" className={RHF_ERROR_TEXT_CLASS}>
          {TURNSTILE_UNAVAILABLE_MESSAGE}
        </p>
      )}
      {typeof message === "string" && (
        <p role="alert" className={RHF_ERROR_TEXT_CLASS}>
          {message}
        </p>
      )}
    </div>
  );
}
