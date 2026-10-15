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
  // Only the configured admin may sign in to the studio.
  if (!isAdminEmail(email)) {
    return { error: "This account is not allowed." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/studio");
}
