import {
  AboutMe,
  ClientsFeedback,
  ExpertSolutions,
  FeaturedWorks,
  Hero,
  PlayReel,
  Progress,
  Quotes,
  Steps,
  TrustedFounders,
} from "./components";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutMe />
      <Progress />
      <Steps />
      <FeaturedWorks />
      <Quotes />
      <ExpertSolutions />
      <PlayReel />
      <TrustedFounders />
      <ClientsFeedback />
    </main>
  );
}
