import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/blog/supabase/proxy-session";

/**
 * Next.js 16 Proxy (formerly Middleware). Runs only on /studio routes to keep
 * the admin session fresh and redirect unauthenticated visitors to login.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/studio/:path*"],
};
