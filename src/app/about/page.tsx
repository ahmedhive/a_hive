import type { Metadata } from "next";
import { About } from "@/features";

export const metadata: Metadata = {
  title: "About | Ahmed Hive",
  description:
    "Meet Ahmed Hive, a Product Manager and Product Designer helping founders turn complex ideas into clean, high converting digital products.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <About />;
}
