"use client";

import { sendContactMessage } from "../../../../send-contact-message";
import ContactForm from "../..";
import { CONTACT_BASE_DEFAULT_VALUES } from "../../contact-form.data";
import { contactBaseSchema } from "../../contact-form.schema";

// The say-hello form is just the fields both forms share.
export default function SayHelloForm() {
  return (
    <ContactForm
      schema={contactBaseSchema}
      defaultValues={CONTACT_BASE_DEFAULT_VALUES}
      send={(values) => sendContactMessage({ form: "say-hello", values })}
    />
  );
}
