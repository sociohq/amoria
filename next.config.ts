import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Backblaze B2 bucket/region is env-specific, so this is deliberately
    // broad rather than pinning one hostname.
    remotePatterns: [{ protocol: "https", hostname: "**.backblazeb2.com" }],
  },
};

export default nextConfig;
