import { notFound } from "next/navigation";
import { PostEditor } from "@/components/blog/PostEditor";
import { createSupabaseServerClient } from "@/lib/blog/supabase/server";
import { getPostById } from "@/lib/blog/posts";
import {
  savePostAction,
  uploadImageAction,
  deletePostAction,
} from "@/app/studio/actions";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const post = await getPostById(supabase, id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold uppercase tracking-[0.15em]">
        Edit post
      </h1>
      <PostEditor
        post={post}
        saveAction={savePostAction}
        uploadAction={uploadImageAction}
        deleteAction={deletePostAction}
      />
    </div>
  );
}
