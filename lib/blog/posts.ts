import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase/database.types";
import type { Post, PostInsert, PostUpdate } from "./types";

type DB = SupabaseClient<Database>;

/** Published posts, newest first. Optionally filtered by a single tag. */
export async function listPublishedPosts(
  db: DB,
  opts: { tag?: string } = {},
): Promise<Post[]> {
  let query = db.from("posts").select("*").eq("status", "published");
  if (opts.tag) query = query.contains("tags", [opts.tag]);
  const { data, error } = await query.order("published_at", { ascending: false });
  if (error) throw new Error(`listPublishedPosts: ${error.message}`);
  return data ?? [];
}

/** A single published post by slug, or null. */
export async function getPublishedPostBySlug(
  db: DB,
  slug: string,
): Promise<Post | null> {
  const { data, error } = await db
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(`getPublishedPostBySlug: ${error.message}`);
  return data ?? null;
}

/** All posts (drafts + published) for the admin studio, most-recently-edited first. */
export async function listAllPosts(db: DB): Promise<Post[]> {
  const { data, error } = await db
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`listAllPosts: ${error.message}`);
  return data ?? [];
}

/** A single post of any status by id (admin). */
export async function getPostById(db: DB, id: string): Promise<Post | null> {
  const { data, error } = await db
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`getPostById: ${error.message}`);
  return data ?? null;
}

/** All existing slugs — used to generate a unique slug for a new post. */
export async function listTakenSlugs(db: DB): Promise<string[]> {
  const { data, error } = await db.from("posts").select("slug");
  if (error) throw new Error(`listTakenSlugs: ${error.message}`);
  return (data ?? []).map((row) => row.slug);
}

export async function createPost(db: DB, input: PostInsert): Promise<Post> {
  const { data, error } = await db.from("posts").insert(input).select().single();
  if (error) throw new Error(`createPost: ${error.message}`);
  return data as Post;
}

export async function updatePost(
  db: DB,
  id: string,
  input: PostUpdate,
): Promise<Post> {
  const { data, error } = await db
    .from("posts")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`updatePost: ${error.message}`);
  return data as Post;
}

export async function deletePost(db: DB, id: string): Promise<void> {
  const { error } = await db.from("posts").delete().eq("id", id);
  if (error) throw new Error(`deletePost: ${error.message}`);
}
