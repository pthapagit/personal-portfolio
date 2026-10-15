import { PostEditor } from "@/components/blog/PostEditor";
import { savePostAction, uploadImageAction } from "@/app/studio/actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold uppercase tracking-[0.15em]">
        New post
      </h1>
      <PostEditor saveAction={savePostAction} uploadAction={uploadImageAction} />
    </div>
  );
}
