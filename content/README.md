# Portfolio content (single source of truth)

All visitor-facing copy lives in this folder. The 3D desk panels, CRT terminal,
2D directory, and SEO metadata all read from here — edit once, everywhere updates.

## Files

| File | What it drives |
| ---- | -------------- |
| [`index.ts`](index.ts) | Profile, sections map, skills, experience, timeline, certifications, resume |
| [`projects.ts`](projects.ts) | Current projects (Coffee Mug / `PROJECTS` command) |
| [`types.ts`](types.ts) | TypeScript shapes — change only when adding new fields |

## Desk object map

| Desk object | Section export |
| ----------- | -------------- |
| Computer monitor | `profile` (via About / terminal) |
| Keyboard | `skills` |
| Notebook | `resume` |
| Filing cabinet | `experience` |
| Coffee mug | `projects` (in `projects.ts`) |
| Desk phone | `profile.links` (Contact) |
| Calendar | `timeline` |
| Employee badge | `certifications` |
| Window | Decorative only (not a section) |

## How to edit

1. Open the matching file above.
2. Change strings / arrays in place. Keep TypeScript types happy.
3. Put a PDF at `public/resume.pdf` if you want the Resume download button (already wired via `resume.downloadUrl`).
4. Commit and redeploy (or push to GitHub if Vercel auto-deploys).

## Adding a project from a GitHub repo

Paste a repo URL in chat, for example:

`https://github.com/PrabeshThapa/my-repo`

Ask the agent to add it. The agent should:

1. Fetch repo metadata (description, language, topics, README summary).
2. Append one object to the `projects` array in [`projects.ts`](projects.ts):

```ts
{
  name: "repo-name",
  description: "…",
  tech: ["TypeScript", "…"],
  link: "https://github.com/…",
  status: "active", // or "shipped" | "archived"
}
```

3. Leave other content files alone unless you asked for more changes.
