"use client";

import ContactForm from "../..";
import { CONTACT_BASE_DEFAULT_VALUES } from "../../contact-form.data";
import { contactBaseSchema } from "../../contact-form.schema";

// The say-hello form is just the fields both forms share.
export default function SayHelloForm() {
  return (
    <ContactForm
      schema={contactBaseSchema}
      defaultValues={CONTACT_BASE_DEFAULT_VALUES}
    />
  );
}
