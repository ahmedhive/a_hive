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
