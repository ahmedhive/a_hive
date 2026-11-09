import { Quotes, TrustedFounders } from "../components";
import {
  HatsIWear,
  HeroBanner,
  LifeBehindTheWork,
  StatsGrid,
  WhyWorkWithMe,
} from "./components";

export default function About() {
  return (
    <main id="main-content">
      <HeroBanner />
      <StatsGrid />
      <WhyWorkWithMe />
      <HatsIWear />
      <Quotes />
      <TrustedFounders />
      <LifeBehindTheWork />
    </main>
  );
}
