import {
  AboutMe,
  FeaturedWorks,
  Hero,
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
    </main>
  );
}
