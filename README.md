# Personal Portfolio — The Office

An immersive portfolio inspired by the mood of retro corporate offices: a slow
camera move down a quiet corridor ends at a single cubicle, where every object
on the desk opens a chapter of my career. All 3D geometry is procedural —
no downloaded models, no copyrighted assets.

## The desk

| Object          | Section          |
| --------------- | ---------------- |
| Computer monitor| About Me (opens a CRT terminal) |
| Keyboard        | Technical Skills |
| Notebook        | Resume           |
| Filing cabinet  | Work Experience  |
| Coffee mug      | Current Projects |
| Desk phone      | Contact          |
| Calendar        | Career Timeline  |
| Window          | Blog             |
| Employee badge  | Certifications   |

The monitor behaves like a vintage terminal: `HELP`, `ABOUT`, `PROJECTS`,
`SKILLS`, `RESUME`, `CONTACT`, `CLEAR`, `ASK <question>` (assistant stub),
`EXIT`.

## Editing your content

Everything lives in [`content/index.ts`](content/index.ts) — bio, skills,
experience, projects, timeline, blog posts, certifications. Entries marked
`TODO` are placeholders. Drop a `resume.pdf` into `public/` and set
`resume.downloadUrl` to enable the download button.

## Modes

- **3D office** — desktop browsers with WebGL. Skippable cinematic intro,
  clickable hotspots, keyboard-accessible floor directory.
- **2D directory** — mobile, reduced-motion, or no-WebGL visitors get a
  server-rendered document version of the same content (also what search
  engines index). Both modes can switch to the other.

## Stack

Next.js (App Router) · TypeScript · React Three Fiber · Drei · GSAP ·
Tailwind CSS · Framer Motion · deployed on Vercel.

## Development

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` in production for correct SEO/OG URLs.

## Enabling the AI assistant later

The terminal's `ASK` command calls `askAssistant()` in
[`lib/assistant.ts`](lib/assistant.ts), currently a stub. To enable RAG:
implement an API route that embeds the question, retrieves matching content
chunks, calls an LLM, and return its answer from `askAssistant` — the
terminal UI needs no changes.
