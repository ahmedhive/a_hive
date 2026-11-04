import type { Metadata } from "next";
import { SITE_NAME } from "@/data/site";

const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
};

interface IPageMetadataInput {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

// A page's metadata. Next replaces openGraph and twitter as a whole when a
// page sets them, so each page restates its own title, description and image
// here instead of inheriting the home page's.
export function buildPageMetadata(input: IPageMetadataInput): Metadata {
  const { title, description, path, noIndex } = input;

  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noIndex && { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en-US",
      type: "website",
      images: [{ ...OG_IMAGE, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: OG_IMAGE.url, alt: title }],
    },
  };
}
