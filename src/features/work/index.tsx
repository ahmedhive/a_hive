import { connection } from "next/server";
import { WORK } from "@/data/work";
import { shuffle } from "@/lib/utils";
import { WorkHero } from "../components";
import { ServiceTicker, ShippedProducts } from "./components";
import { WORK_HERO_CTA, WORK_HERO_TITLE } from "./work.data";

export default async function Work() {
  // The projects are shown in a new random order on every visit, so this page
  // is rendered per request instead of once at build time.
  await connection();

  return (
    <main id="main-content">
      <WorkHero title={WORK_HERO_TITLE} cta={WORK_HERO_CTA} />
      <ServiceTicker />
      <ShippedProducts work={shuffle(WORK)} />
    </main>
  );
}
