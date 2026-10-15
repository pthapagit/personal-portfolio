"use client";

import { useActionState, useId, useRef, useState } from "react";
import { slugify } from "@/lib/blog/slug";
import { MarkdownView } from "@/components/blog/MarkdownView";
import type { Post } from "@/lib/blog/types";
import type { SaveState, UploadResult } from "@/app/studio/types";

interface PostEditorProps {
  post?: Post | null;
  saveAction: (prev: SaveState, formData: FormData) => Promise<SaveState>;
  uploadAction: (formData: FormData) => Promise<UploadResult>;
  deleteAction?: (formData: FormData) => Promise<void>;
}

export function PostEditor({
  post,
  saveAction,
  uploadAction,
  deleteAction,
}: PostEditorProps) {
  const [state, formAction, pending] = useActionState(saveAction, {} as SaveState);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [content, setContent] = useState(post?.content_md ?? "");
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const ids = useId();
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadAction(fd);
    setUploading(false);
    if (res.error) {
      setUploadError(res.error);
      return null;
    }
    return res.url ?? null;
  }

  async function onCoverSelected(file: File | undefined) {
    if (!file) return;
    const url = await upload(file);
    if (url) setCoverUrl(url);
  }

  async function onBodyImageSelected(file: File | undefined) {
    if (!file) return;
    const url = await upload(file);
    if (url) setContent((c) => `${c}${c.endsWith("\n") || c === "" ? "" : "\n\n"}![](${url})\n`);
  }

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <div className="mx-auto max-w-5xl">
      <form action={formAction} className="flex flex-col gap-5">
        {post ? <input type="hidden" name="id" value={post.id} /> : null}
        <input type="hidden" name="cover_image_url" value={coverUrl ?? ""} />

        {state.error ? (
          <p role="alert" className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
            {state.error}
          </p>
        ) : null}

        <label className="flex flex-col gap-1" htmlFor={`${ids}-title`}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            Title
          </span>
          <input
            id={`${ids}-title`}
            name="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            className="rounded-md border border-ink/20 bg-paper px-3 py-2 text-lg text-ink outline-none focus:border-office-green"
          />
          {fieldErrors.title ? (
            <span className="text-xs text-red-700">{fieldErrors.title[0]}</span>
          ) : null}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1" htmlFor={`${ids}-slug`}>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
              Slug
            </span>
            <input
              id={`${ids}-slug`}
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="rounded-md border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-office-green"
            />
          </label>

          <label className="flex flex-col gap-1" htmlFor={`${ids}-tags`}>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
              Tags (comma separated)
            </span>
            <input
              id={`${ids}-tags`}
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="travel, reading, thoughts"
              className="rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-office-green"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1" htmlFor={`${ids}-excerpt`}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            Excerpt (optional — auto-generated if blank)
          </span>
          <textarea
            id={`${ids}-excerpt`}
            name="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-office-green"
          />
        </label>

        {/* Cover image */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            Cover image
          </span>
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt="Cover preview"
              className="max-h-48 w-full rounded-md object-cover"
            />
          ) : null}
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              aria-label="Upload cover image"
              onChange={(e) => onCoverSelected(e.target.files?.[0])}
              className="text-sm"
            />
            {coverUrl ? (
              <button
                type="button"
                onClick={() => setCoverUrl("")}
                className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>

        {/* Body with write / preview */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
              Post body (Markdown)
            </span>
            <div className="flex gap-1 sm:hidden">
              <button
                type="button"
                onClick={() => setTab("write")}
                className={`rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${
                  tab === "write" ? "bg-office-green text-paper" : "text-ink-soft"
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${
                  tab === "preview" ? "bg-office-green text-paper" : "text-ink-soft"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={tab === "write" ? "" : "hidden sm:block"}>
              <label className="sr-only" htmlFor={`${ids}-body`}>
                Post body markdown
              </label>
              <textarea
                id={`${ids}-body`}
                name="content_md"
                ref={bodyRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                className="h-full min-h-[18rem] w-full rounded-md border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-office-green"
                placeholder="Write your post in Markdown..."
              />
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Insert image into post"
                  onChange={(e) => onBodyImageSelected(e.target.files?.[0])}
                  className="text-xs"
                />
                {uploading ? (
                  <span className="text-xs text-ink-soft">{"Uploading\u2026"}</span>
                ) : null}
              </div>
              {uploadError ? (
                <p className="mt-1 text-xs text-red-700">{uploadError}</p>
              ) : null}
            </div>

            <div
              className={`prose prose-sm max-w-none rounded-md border border-ink/10 bg-paper-dark/40 p-4 ${
                tab === "preview" ? "" : "hidden sm:block"
              }`}
              aria-label="Preview"
            >
              {content.trim() ? (
                <MarkdownView>{content}</MarkdownView>
              ) : (
                <p className="text-sm text-ink-soft">Nothing to preview yet.</p>
              )}
            </div>
          </div>
          {fieldErrors.content_md ? (
            <span className="text-xs text-red-700">{fieldErrors.content_md[0]}</span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-4">
          <button
            type="submit"
            name="status"
            value="draft"
            disabled={pending || uploading}
            className="rounded-md border border-office-green px-4 py-2 font-mono text-sm uppercase tracking-[0.2em] text-office-green disabled:opacity-60"
          >
            {pending ? "Saving\u2026" : "Save draft"}
          </button>
          <button
            type="submit"
            name="status"
            value="published"
            disabled={pending || uploading}
            className="rounded-md bg-office-green px-4 py-2 font-mono text-sm uppercase tracking-[0.2em] text-paper disabled:opacity-60"
          >
            {pending ? "Saving\u2026" : "Publish"}
          </button>
        </div>
      </form>

      {post && deleteAction ? (
        <form
          action={deleteAction}
          className="mt-8 border-t border-ink/10 pt-4"
          onSubmit={(e) => {
            if (!confirm("Delete this post permanently?")) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={post.id} />
          <button
            type="submit"
            className="font-mono text-xs uppercase tracking-[0.2em] text-red-700 hover:underline"
          >
            Delete post
          </button>
        </form>
      ) : null}
    </div>
  );
}
