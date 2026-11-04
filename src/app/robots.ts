import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

// Everything is open to every crawler, search and AI-search bots included.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
