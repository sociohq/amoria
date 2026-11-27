import type { MetadataRoute } from "next";

const SITE_URL = "https://amoriaperfume.ae";

// Standard robots.txt. No Cloudflare content-signal text is stored in this repo.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/account", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
