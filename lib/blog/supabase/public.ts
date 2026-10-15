import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseConfig } from "./env";

/**
 * Anonymous Supabase client for public reads (published posts). It carries no
 * user session/cookies, so pages using it stay cacheable instead of being
 * forced dynamic.
 */
export function createSupabasePublicClient() {
  const { url, key } = getSupabaseConfig();
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
