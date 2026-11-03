import { Quotes, TrustedFounders } from "../components";
import { HatsIWear, HeroBanner, StatsGrid, WhyWorkWithMe } from "./components";

export default function About() {
  return (
    <main>
      <HeroBanner />
      <StatsGrid />
      <WhyWorkWithMe />
      <HatsIWear />
      <Quotes />
      <TrustedFounders />
    </main>
  );
}
