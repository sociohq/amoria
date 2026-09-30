import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Backblaze B2 bucket/region is env-specific, so this is deliberately
    // broad rather than pinning one hostname.
    remotePatterns: [{ protocol: "https", hostname: "**.backblazeb2.com" }],
    // This network's DNS resolves the B2 hostname to a NAT64-synthesized
    // IPv6 address (64:ff9b::/96, embedding the real public IPv4 address) —
    // Next 16's new SSRF guard treats that range as "private" and blocks
    // the fetch with a 400 by default. B2 is a real public multi-tenant
    // bucket, not internal infrastructure, so this is a false positive for
    // us rather than an actual SSRF exposure.
    dangerouslyAllowLocalIP: true,
    // B2 URLs are content-addressed by a unique UUID per upload and never
    // change once created, so the optimized/resized cache entry is safe to
    // keep indefinitely instead of expiring after Next's 60s default.
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
