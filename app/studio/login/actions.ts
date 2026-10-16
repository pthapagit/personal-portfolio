"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/blog/supabase/server";
import { isAdminEmail } from "@/lib/blog/admin";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();

  // Attempt the sign-in for ANY email (not just the admin's) so the response
  // timing is identical regardless of the email tried. Short-circuiting on
  // isAdminEmail() before the network call used to leak the admin address via
  // a timing side-channel. The admin check happens after, and a non-admin
  // session (possible if public signups are on) is immediately discarded.
  // Brute-force is covered by Supabase's auth rate limiting.
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !isAdminEmail(data.user?.email)) {
    if (!error) await supabase.auth.signOut();
    return { error: "Invalid email or password." };
  }

  redirect("/studio");
}
