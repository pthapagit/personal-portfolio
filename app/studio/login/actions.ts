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
  // Only the configured admin may sign in. Use the same generic message as a
  // failed sign-in below so the response doesn't reveal which email is the
  // admin (no account enumeration).
  if (!isAdminEmail(email)) {
    return { error: "Invalid email or password." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/studio");
}
