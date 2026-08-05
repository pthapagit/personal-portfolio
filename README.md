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

## Modes

- **3D office** — desktop browsers with WebGL. Skippable cinematic intro,
  clickable hotspots, keyboard-accessible floor directory.
- **2D directory** — mobile, reduced-motion, or no-WebGL visitors get a
  server-rendered document version of the **same** `content/` data (also what
  search engines index). Both modes can switch to the other.

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
