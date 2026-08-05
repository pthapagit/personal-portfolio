import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: set NEXT_PUBLIC_SITE_URL (or replace the fallback) once deployed.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://prabeshthapa.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s · ${profile.name}`,
  },
  description: `${profile.tagline} Step into a retro-corporate 3D office and explore the desk of ${profile.name}, ${profile.title.toLowerCase()} — projects, skills, experience and more.`,
  keywords: [profile.name, "software engineer", "portfolio", "3D portfolio", "React Three Fiber", "Next.js"],
  authors: [{ name: profile.name, url: profile.links.github }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: `${profile.name} — Portfolio`,
    title: `${profile.name} — ${profile.title}`,
    description: `An explorable retro-corporate office. Every object on the desk opens a chapter of ${profile.name}'s career.`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: `An explorable retro-corporate office portfolio.`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f1ead8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
