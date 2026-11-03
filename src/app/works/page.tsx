import type { Metadata } from "next";
import { Works } from "@/features";

export const metadata: Metadata = {
  title: "Works | Ahmed Hive",
  description:
    "A history of the products Ahmed Hive has shipped, from the first roadmap to the launch.",
  alternates: { canonical: "/works" },
};

export default function Page() {
  return <Works />;
}
