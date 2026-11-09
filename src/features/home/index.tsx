import {
  ClientsFeedback,
  ExpertSolutions,
  Quotes,
  TrustedFounders,
} from "@/features/components";
import {
  AboutMe,
  FeaturedWork,
  Hero,
  PlayReel,
  Progress,
  Steps,
} from "./components";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <AboutMe />
      <Progress />
      <Steps />
      <FeaturedWork />
      <Quotes />
      <ExpertSolutions />
      <PlayReel />
      <TrustedFounders />
      <ClientsFeedback />
    </main>
  );
}
