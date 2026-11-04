export interface IStatCounterProps {
  value: string;
  className?: string;
}

export type TCounterAlign = "top" | "bottom";

export type TCounterPart =
  | { kind: "digit"; digit: number; align: TCounterAlign }
  | { kind: "dot" }
  | { kind: "suffix"; char: string };
