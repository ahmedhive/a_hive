import { StaticImageData } from "next/image";
import { ComponentType, SVGProps } from "react";

export interface ISocialLink {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface INavLink {
  label: string;
  href: string;
}

export interface IFeaturedWork {
  title: string;
  description: string;
  image: StaticImageData;
  href: string;
  // Text pane and image pane are two shades of the same hue.
  paneColor: string;
  imagePaneColor: string;
}

interface IWorkBase {
  // The URL segment of the project's page (/works/<slug>); unique.
  slug: string;
  title: string;
  description: string;
  tags: string[];
  listImage: StaticImageData;
}

// A featured work (at most MAX_FEATURED_WORKS of them) also carries what the
// home page's stacked cards need; the rest must not.
export type IWork =
  | (IWorkBase & { featured: false })
  | (IWorkBase & {
      featured: true;
      featuredImage: StaticImageData;
      // Text pane and image pane are two shades of the same hue.
      paneColor: string;
      imagePaneColor: string;
    });

// What a project's own page shows, beyond the list fields in IWork.
export interface IWorkDetails {
  slug: string;
  // The facts under the title, e.g. Client, Country.
  meta: { label: string; value: string }[];
  // The project's public site; the hero's "Visit Site" button shows only when
  // this is set.
  visitSiteHref?: string;
  bannerImage: StaticImageData;
  challenge: { title: string; lead: string; text: string };
  showcaseImages: [StaticImageData, StaticImageData];
  overview: {
    title: string;
    text: string;
    stats: { value: string; label: string }[];
  };
  descImage: StaticImageData;
  // Each entry is one line of the big scroll-revealed quote.
  quote: string[];
  result: {
    title: string;
    text: string;
    images: StaticImageData[];
    // The section's background, also used for the lines under it.
    bgClassName: string;
  };
}
