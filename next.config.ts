import path from "node:path";
import type { NextConfig } from "next";

// Allow next/image to serve images from the Supabase Storage public bucket.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Block MIME sniffing of responses.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Disallow embedding the site in frames (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          // Don't leak full URLs to other origins.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // This site never needs these browser capabilities.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
