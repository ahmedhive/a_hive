import { connection } from "next/server";
import { WORKS } from "@/data/works";
import { shuffle } from "@/lib/utils";
import { HeroBanner, ServiceTicker, ShippedProducts } from "./components";

export default async function Works() {
  // The projects are shown in a new random order on every visit, so this page
  // is rendered per request instead of once at build time.
  await connection();

  return (
    <main>
      <HeroBanner />
      <ServiceTicker />
      <ShippedProducts works={shuffle(WORKS)} />
    </main>
  );
}
