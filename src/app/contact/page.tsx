import type { Metadata } from "next";
import { Contact } from "@/features";

export const metadata: Metadata = {
  title: "Contact | Ahmed Hive",
  description:
    "Say hello or start a project with Ahmed Hive, a Product Manager and Product Designer who takes ideas from roadmap to shipped product.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <Contact />;
}
