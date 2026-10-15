import path from "node:path";
import type { NextConfig } from "next";

// Allow next/image to serve images from the Supabase Storage public bucket.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;
const supabaseOrigin = supabaseHost ? `https://${supabaseHost}` : "";

// Static (non-nonce) Content-Security-Policy. Kept non-nonce on purpose: a
// nonce CSP forces every page to render dynamically, which would disable the
// ISR used by the blog and home page. Stored XSS is already mitigated at the
// source (react-markdown escapes raw HTML + rehype-sanitize); this is
// defense-in-depth. 'unsafe-inline' is needed for Next's inline bootstrap
// scripts and Framer Motion's inline styles.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${supabaseOrigin ? ` ${supabaseOrigin}` : ""}`,
  "font-src 'self'",
  // Supabase (auth + REST) and the Vercel Analytics / Speed Insights beacons.
  `connect-src 'self'${supabaseOrigin ? ` ${supabaseOrigin}` : ""} https://vitals.vercel-insights.com`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

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
          { key: "Content-Security-Policy", value: csp },
          // Force HTTPS for two years, including subdomains (HSTS preload).
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
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
