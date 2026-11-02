import {
  AboutMe,
  ExpertSolutions,
  FeaturedWorks,
  Hero,
  PlayReel,
  Progress,
  Quotes,
  Steps,
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
    </main>
  );
}
