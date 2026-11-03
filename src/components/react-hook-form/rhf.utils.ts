import { IRHFFieldOwnProps } from "./rhf-field/rhf-field.interface";

// Separates the props a field component hands to RHFField from the rest,
// which belong to the native control.
export const splitFieldProps = <TProps extends IRHFFieldOwnProps>(
  props: TProps,
) => {
  const {
    name,
    label,
    required,
    labelClassName,
    wrapperClassName,
    disabled,
    ...rest
  } = props;

  return {
    fieldProps: {
      name,
      label,
      required,
      labelClassName,
      wrapperClassName,
      disabled,
    },
    rest,
  };
};
