import type { Tables, TablesInsert, TablesUpdate } from "./supabase/database.types";

/** A blog post row as stored in Supabase. */
export type Post = Tables<"posts">;
export type PostInsert = TablesInsert<"posts">;
export type PostUpdate = TablesUpdate<"posts">;

export type PostStatus = "draft" | "published";

/** The subset of fields the editor sends when creating/updating a post. */
export interface PostDraft {
  title: string;
  slug?: string;
  excerpt?: string;
  content_md: string;
  cover_image_url?: string | null;
  tags: string[];
  status: PostStatus;
}
