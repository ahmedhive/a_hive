import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Next sends this by default, giving away the framework for free — no
  // functional purpose, so it's turned off alongside the headers below.
  poweredByHeader: false,
  // 90 is for the large project banners, which should keep their detail; the
  // rest use the default. AVIF is tried first and WebP is the fallback: the
  // same pixels at a smaller size.
  images: { qualities: [75, 90], formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      // The clips and posters aren't fingerprinted, so a day of caching (with
      // a week of stale-while-revalidate) keeps replacements from going stale
      // for long. Production only: in dev a swapped file must show up at once.
      ...(process.env.NODE_ENV === "production"
        ? [
            {
              source: "/videos/:path*",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=86400, stale-while-revalidate=604800",
                },
              ],
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
