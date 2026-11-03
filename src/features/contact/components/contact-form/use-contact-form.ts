import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { IContactFormProps } from "./contact-form.interface";

export default function useContactForm<TValues extends FieldValues>(
  props: Pick<IContactFormProps<TValues>, "schema" | "defaultValues">,
) {
  const { schema, defaultValues } = props;

  const methods = useForm<TValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // The entries are only logged for now; the form clears once they are.
  const onSubmit = methods.handleSubmit((values) => {
    console.log(values);
    methods.reset();
  });

  return { methods, onSubmit };
}
