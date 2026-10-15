"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/blog/auth";
import { createSupabaseServerClient } from "@/lib/blog/supabase/server";
import { postDraftSchema, parseTagsInput } from "@/lib/blog/schema";
import { buildPostRecord } from "@/lib/blog/build-post";
import { checkImageUpload } from "@/lib/blog/image-upload";
import {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  listTakenSlugs,
} from "@/lib/blog/posts";
import type { SaveState, UploadResult } from "./types";

function revalidateBlog(slug?: string) {
  revalidatePath("/studio");
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function savePostAction(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const parsed = postDraftSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content_md: formData.get("content_md") ?? "",
    cover_image_url: formData.get("cover_image_url") ?? null,
    tags: parseTagsInput(String(formData.get("tags") ?? "")),
    status: formData.get("status") ?? "draft",
    font: formData.get("font") || undefined,
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const takenSlugs = await listTakenSlugs(supabase);

  let currentSlug: string | null = null;
  let currentPublishedAt: string | null = null;
  if (id) {
    const existing = await getPostById(supabase, id);
    if (existing) {
      currentSlug = existing.slug;
      currentPublishedAt = existing.published_at;
    }
  }

  const record = buildPostRecord({
    draft: parsed.data,
    takenSlugs,
    currentSlug,
    currentPublishedAt,
  });

  try {
    if (id) {
      await updatePost(supabase, id, record);
    } else {
      await createPost(supabase, record);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save the post." };
  }

  revalidateBlog(record.slug);
  redirect("/studio");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  const post = await getPostById(supabase, id);
  await deletePost(supabase, id);
  revalidateBlog(post?.slug);
  redirect("/studio");
}

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadResult> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file selected." };
  }
  const check = checkImageUpload(file.type, file.size);
  if (!check.ok) {
    return { error: check.error };
  }

  const supabase = await createSupabaseServerClient();
  // Random server-chosen name + allow-listed extension (never the client's).
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${check.ext}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/studio/login");
}
