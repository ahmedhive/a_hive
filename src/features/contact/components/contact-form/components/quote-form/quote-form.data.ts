import { IRHFSelectOption } from "@/components/react-hook-form/rhf-select/rhf-select.interface";
import { CONTACT_BASE_DEFAULT_VALUES } from "../../contact-form.data";

// The value that opens the free-text field below the selects.
export const QUOTE_OTHER_PROJECT_TYPE = "Other";

// The values the form accepts; each is also its own label.
export const QUOTE_PROJECT_TYPES = [
  "Product Management",
  "Product Design",
  "Product Engineering",
  "Technical Audit",
  "End-to-End Delivery",
  "Partnership",
  QUOTE_OTHER_PROJECT_TYPE,
] as const;
export const QUOTE_BUDGETS = [
  "5k-10k",
  "10k-15k",
  "15k-20k",
  "20k-50k",
  "Let's Discuss Scope",
] as const;

const toOptions = (values: readonly string[]): IRHFSelectOption[] =>
  values.map((value) => ({ label: value, value }));

export const QUOTE_PROJECT_TYPE_OPTIONS = toOptions(QUOTE_PROJECT_TYPES);
export const QUOTE_BUDGET_OPTIONS = toOptions(QUOTE_BUDGETS);

export const QUOTE_PROJECT_TYPE_LABEL = "Project Type";
export const QUOTE_BUDGET_LABEL = "Budget";
export const QUOTE_OTHER_LABEL = "Tell Us More";
export const QUOTE_OTHER_PLACEHOLDER = "Describe your project type";
export const QUOTE_OTHER_MAX_LENGTH = 120;
export const QUOTE_SELECT_PLACEHOLDER = "Select";

// Nothing is chosen until the visitor picks, so both start empty.
export const QUOTE_EMPTY_CHOICE = "";
export const QUOTE_DEFAULT_VALUES = {
  ...CONTACT_BASE_DEFAULT_VALUES,
  projectType: QUOTE_EMPTY_CHOICE,
  budget: QUOTE_EMPTY_CHOICE,
  projectTypeOther: "",
};
