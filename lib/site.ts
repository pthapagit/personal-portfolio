/** Canonical site URL for metadata, sitemap, and robots. */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://prabeshthapa.vercel.app";
}
