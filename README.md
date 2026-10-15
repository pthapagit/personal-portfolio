# Personal Portfolio — The Office

An immersive portfolio inspired by the mood of retro corporate offices: a slow
camera move down a quiet corridor ends at a single cubicle, where every object
on the desk opens a chapter of my career. All 3D geometry is procedural —
no downloaded models, no copyrighted assets.

## The desk

| Object           | Section                              |
| ---------------- | ------------------------------------ |
| Computer monitor | About Me (opens a CRT terminal)      |
| Keyboard         | Technical Skills                     |
| Notebook         | Resume                               |
| Filing cabinet   | Work Experience                      |
| Coffee mug       | Current Projects                     |
| Desk phone       | Contact                              |
| Calendar         | Career Timeline                      |
| Employee badge   | Certifications                       |

The monitor behaves like a vintage terminal: `HELP`, `ABOUT`, `PROJECTS`,
`SKILLS`, `RESUME`, `CONTACT`, `CLEAR`, `ASK <question>` (assistant stub),
`EXIT`.

## Editing your content

**Single source of truth:** the [`content/`](content/) folder. Edit there once —
2D, 3D, `/resume`, and recruiter `/resume.pdf` all update together.

- Bio, skills, experience, timeline, certifications, resume → [`content/index.ts`](content/index.ts)
- Projects → [`content/projects.ts`](content/projects.ts)
- Field guide → [`content/README.md`](content/README.md)

To add a GitHub project later, paste the repo URL in chat and ask the agent to
append it to `content/projects.ts`.

## Blog — write from the UI, like a personal Substack

A self-hosted blog for writing about what I read and where I travel. Posts are
**authored from the browser**, not by editing code.

- **Read:** [`/blog`](app/blog) — mobile-first reader with tag filtering,
  per-post reading time, publish date, Markdown rendering, and LinkedIn /
  copy-link share buttons. A "Latest writing" widget also surfaces recent posts
  on the home directory.
- **Write:** [`/studio`](app/studio) — password-protected admin. Create and edit
  posts in a Markdown editor with live preview, upload a cover image and inline
  images, add tags, and save as **draft** or **publish**. Only the configured
  admin email can sign in; everything else is guarded by [`proxy.ts`](proxy.ts).

Blog content lives in **Supabase** (Postgres + Storage + Auth), *not* in
`content/`. The `content/` folder still owns the portfolio surfaces (2D/3D,
resume); the blog is managed entirely through the `/studio` UI.

### Environment variables

Set these locally in `.env.local` and in the Vercel project (Production +
Preview). The Supabase anon key is a public, RLS-protected key — safe to expose.

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (publishable) key |
| `ADMIN_EMAIL` | The only email allowed to sign in to `/studio` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used for share links / OG) |

## Modes

- **3D office** — desktop browsers with WebGL. Skippable cinematic intro,
  clickable hotspots, keyboard-accessible floor directory.
- **2D directory** — mobile, reduced-motion, or no-WebGL visitors get a
  server-rendered document version of the **same** `content/` data (also what
  search engines index). Both modes can switch to the other.

## Stack

Next.js (App Router) · TypeScript · React Three Fiber · Drei · GSAP ·
Tailwind CSS · Framer Motion · Supabase (blog) · deployed on Vercel.

## Development

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` in production for correct SEO/OG URLs, and the
Supabase / `ADMIN_EMAIL` variables above for the blog.

### Testing (TDD)

```bash
npm run test        # Vitest unit + component tests (jsdom)
npm run test:watch  # Vitest in watch mode
npm run test:e2e    # Playwright end-to-end (boots the dev server)
```

The Playwright blog flow (login → draft → upload → publish → read → share)
needs admin credentials and self-skips without them:

```bash
PLAYWRIGHT_ADMIN_EMAIL="you@example.com" \
PLAYWRIGHT_ADMIN_PASSWORD="…" \
npm run test:e2e
```

## Enabling the AI assistant later

The terminal's `ASK` command calls `askAssistant()` in
[`lib/assistant.ts`](lib/assistant.ts), currently a stub. To enable RAG:
implement an API route that embeds the question, retrieves matching content
chunks, calls an LLM, and return its answer from `askAssistant` — the
terminal UI needs no changes.
