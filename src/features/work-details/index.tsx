import { DecorativeLines } from "@/components";
import {
  TAPERED_LINE_GAP_PX,
  TAPERED_LINE_HEIGHTS_PX,
  TAPERED_LINE_RESPONSIVE_HEIGHTS,
} from "@/components/decorative-lines/decorative-lines.data";
import { cn } from "@/lib/utils";
import {
  Challenge,
  FluidImage,
  ImageShowcase,
  QuoteReveal,
  WorkHero,
  WorkOverview,
  WorkResult,
} from "./components";
import {
  AFTER_LINES_SPACER_CLASS,
  BANNER_CLASS,
  DESC_IMAGE_CLASS,
} from "./work-details.data";
import { IWorkDetailsProps } from "./work-details.interface";

export default function WorkDetails(props: IWorkDetailsProps) {
  const { work, details } = props;

  return (
    <main>
      <WorkHero
        title={work.title}
        tags={work.tags}
        meta={details.meta}
        visitSiteHref={details.visitSiteHref}
      />
      <FluidImage
        image={details.bannerImage}
        alt={work.title}
        className={BANNER_CLASS}
        priority
      />
      <Challenge challenge={details.challenge} />
      <ImageShowcase images={details.showcaseImages} />
      <WorkOverview overview={details.overview} />
      <FluidImage
        image={details.descImage}
        alt=""
        className={DESC_IMAGE_CLASS}
      />
      <QuoteReveal lines={details.quote} />
      <WorkResult result={details.result} />
      <DecorativeLines
        heights={TAPERED_LINE_HEIGHTS_PX}
        gap={TAPERED_LINE_GAP_PX}
        lineClassName={details.result.bgClassName}
        className={cn("mt-1 w-full", TAPERED_LINE_RESPONSIVE_HEIGHTS)}
      />
      <div className={AFTER_LINES_SPACER_CLASS} />
    </main>
  );
}
