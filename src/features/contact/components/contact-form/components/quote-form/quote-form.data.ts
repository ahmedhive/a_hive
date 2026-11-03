import { IRHFSelectOption } from "@/components/react-hook-form/rhf-select/rhf-select.interface";
import { CONTACT_BASE_DEFAULT_VALUES } from "../../contact-form.data";

// The values the form accepts; each is also its own label.
export const QUOTE_PROJECT_TYPES = [
  "Design",
  "Development",
  "SEO Optimization",
  "UI/UX Design",
] as const;
export const QUOTE_BUDGETS = ["5k-10k", "8-10k", "12-15k", "16-20k"] as const;

const toOptions = (values: readonly string[]): IRHFSelectOption[] =>
  values.map((value) => ({ label: value, value }));

export const QUOTE_PROJECT_TYPE_OPTIONS = toOptions(QUOTE_PROJECT_TYPES);
export const QUOTE_BUDGET_OPTIONS = toOptions(QUOTE_BUDGETS);

export const QUOTE_PROJECT_TYPE_LABEL = "Project Type";
export const QUOTE_BUDGET_LABEL = "Budget";
export const QUOTE_SELECT_PLACEHOLDER = "Select";

// Nothing is chosen until the visitor picks, so both start empty.
export const QUOTE_EMPTY_CHOICE = "";
export const QUOTE_DEFAULT_VALUES = {
  ...CONTACT_BASE_DEFAULT_VALUES,
  projectType: QUOTE_EMPTY_CHOICE,
  budget: QUOTE_EMPTY_CHOICE,
};
