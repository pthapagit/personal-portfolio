import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { getSupabaseConfig } from "./env";
import { isAdminEmail } from "../admin";
import { studioRedirect } from "../studio-access";

/**
 * Refreshes the Supabase auth session on each request and optimistically
 * guards /studio routes. Follows the @supabase/ssr Next.js pattern, adapted to
 * the Next.js 16 `proxy` convention
 * (node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md).
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const { url, key } = getSupabaseConfig();

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANT: getUser() revalidates the token with Supabase (do not trust
  // getSession() in server code).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const decision = studioRedirect({
    path: request.nextUrl.pathname,
    isAdmin: !!user && isAdminEmail(user.email),
  });

  if (decision) {
    const target = request.nextUrl.clone();
    target.pathname = decision === "login" ? "/studio/login" : "/studio";
    return NextResponse.redirect(target);
  }

  return response;
}
