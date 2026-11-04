export const TURNSTILE_UNAVAILABLE_MESSAGE =
  "The spam check could not load. Please refresh the page and try again.";

// "interaction-only" keeps the widget out of sight unless Cloudflare needs the
// visitor to do something.
export const TURNSTILE_OPTIONS = {
  appearance: "interaction-only",
  theme: "light",
} as const;
export const TURNSTILE_CLASS = "flex flex-col items-center";
// The widget takes no room while it is out of sight; it gets this space only
// while it asks the visitor to do something.
export const TURNSTILE_ACTIVE_CLASS = "mt-6";
