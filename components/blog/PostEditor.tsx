"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { slugify } from "@/lib/blog/slug";
import { readingMinutes } from "@/lib/blog/reading-time";
import { applyFormat, insertAt, type EditResult, type FormatAction } from "@/lib/blog/editor-format";
import { POST_FONTS, FONT_LABELS, fontClass } from "@/lib/blog/fonts";
import { parseTagsInput } from "@/lib/blog/schema";
import { MarkdownView } from "@/components/blog/MarkdownView";
import { EditorToolbar } from "@/components/blog/EditorToolbar";
import { PostArticle } from "@/components/blog/PostArticle";
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
  const [font, setFont] = useState(post?.font ?? "sans");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewAt, setPreviewAt] = useState<string | null>(null);

  const ids = useId();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const previewOpen = previewAt !== null;

  useEffect(() => {
    if (!previewOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreviewAt(null);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [previewOpen]);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function applyEdit(result: EditResult) {
    setContent(result.text);
    requestAnimationFrame(() => {
      const el = bodyRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  }

  function format(action: FormatAction) {
    const el = bodyRef.current;
    const start = el?.selectionStart ?? content.length;
    const end = el?.selectionEnd ?? content.length;
    applyEdit(applyFormat(content, start, end, action));
  }

  function insert(text: string) {
    const el = bodyRef.current;
    const start = el?.selectionStart ?? content.length;
    const end = el?.selectionEnd ?? content.length;
    applyEdit(insertAt(content, start, end, text));
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

  const saveButtons = (
    <>
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
    </>
  );

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
          <div className="flex flex-col gap-1">
            <label
              htmlFor={`${ids}-slug`}
              className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft"
            >
              Slug (web address)
            </label>
            <input
              id={`${ids}-slug`}
              name="slug"
              value={slug}
              aria-describedby={`${ids}-slug-help`}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="rounded-md border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-office-green"
            />
            <span id={`${ids}-slug-help`} className="text-xs text-ink-soft">
              The link people will open:{" "}
              <code className="break-all text-ink">/blog/{(slug || title).trim() ? slugify(slug || title) : "your-title"}</code>
              . Filled in from the title automatically; edit it to customize.
            </span>
          </div>

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

        <label className="flex flex-col gap-1 sm:max-w-xs" htmlFor={`${ids}-font`}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            Font
          </span>
          <select
            id={`${ids}-font`}
            name="font"
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-office-green"
          >
            {POST_FONTS.map((f) => (
              <option key={f} value={f}>
                {FONT_LABELS[f]}
              </option>
            ))}
          </select>
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
              <EditorToolbar onFormat={format} onInsert={insert} />
              <textarea
                id={`${ids}-body`}
                name="content_md"
                ref={bodyRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                className="min-h-[18rem] w-full rounded-b-md border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-office-green"
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
              className={`prose prose-sm max-w-none rounded-md border border-ink/10 bg-paper-dark/40 p-4 ${fontClass(font)} ${
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
            type="button"
            onClick={() => setPreviewAt(post?.published_at ?? new Date().toISOString())}
            className="rounded-md border border-ink/30 px-4 py-2 font-mono text-sm uppercase tracking-[0.2em] text-ink hover:bg-ink/5"
          >
            Full preview
          </button>
          {saveButtons}
        </div>

        {previewOpen ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Full preview"
            className="fixed inset-0 z-50 flex flex-col bg-paper"
          >
            <div className="sticky top-0 z-10 border-b border-ink/10 bg-paper/95 backdrop-blur">
              <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-office-green">
                    Preview
                  </p>
                  <p className="text-xs text-ink-soft">This is exactly how readers will see it.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewAt(null)}
                    className="rounded-md px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
                  >
                    Back to editing
                  </button>
                  {saveButtons}
                </div>
              </div>
              {state.error ? (
                <p role="alert" className="mx-auto max-w-2xl px-4 pb-2 text-sm text-red-700">
                  {state.error}
                </p>
              ) : null}
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-2xl px-4 pb-16 pt-4">
                <PostArticle
                  title={title.trim() || "Untitled post"}
                  publishedAt={previewAt}
                  readingMinutes={readingMinutes(content)}
                  coverImageUrl={coverUrl || null}
                  contentMd={content}
                  tags={parseTagsInput(tags)}
                  font={font}
                  linkTags={false}
                />
              </div>
            </div>
          </div>
        ) : null}
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
