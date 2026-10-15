import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./supabase/server";
import { isAdminEmail } from "./admin";

export { isAdminEmail };

/** The currently signed-in Supabase user, or null. Safe to call anywhere. */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** True when a valid session exists AND the user is the configured admin. */
export async function isAuthedAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return !!user && isAdminEmail(user.email);
}

/**
 * Secure guard for Server Components / Actions / Route Handlers. Redirects to
 * the login page when the caller is not the admin. Returns the user otherwise.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getSessionUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/studio/login");
  }
  return user;
}
