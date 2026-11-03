import type { Metadata } from "next";
import { Services } from "@/features";

export const metadata: Metadata = {
  title: "Services | Ahmed Hive",
  description:
    "Product strategy, product management and product design from one person, from the first roadmap to the shipped product.",
  alternates: { canonical: "/services" },
};

export default function Page() {
  return <Services />;
}
