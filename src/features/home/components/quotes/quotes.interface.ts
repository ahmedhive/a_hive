export type TQuoteCaption = "person" | "label";

export interface IQuote {
  stat: string;
  quote: string;
  title: string;
  subtitle: string;
  variant: TQuoteCaption;
}
