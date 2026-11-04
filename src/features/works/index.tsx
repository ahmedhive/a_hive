import { connection } from "next/server";
import { WORKS } from "@/data/works";
import { shuffle } from "@/lib/utils";
import { WorksHero } from "../components";
import { ServiceTicker, ShippedProducts } from "./components";
import { WORKS_HERO_CTA, WORKS_HERO_TITLE } from "./works.data";

export default async function Works() {
  // The projects are shown in a new random order on every visit, so this page
  // is rendered per request instead of once at build time.
  await connection();

  return (
    <main>
      <WorksHero title={WORKS_HERO_TITLE} cta={WORKS_HERO_CTA} />
      <ServiceTicker />
      <ShippedProducts works={shuffle(WORKS)} />
    </main>
  );
}
