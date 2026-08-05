# Portfolio content (single editable source)

**Edit only these files.** 2D, 3D, the CRT terminal, `/resume`, and the recruiter
PDF download (`/resume.pdf`) all read from here.

| File | What to edit |
| ---- | ------------ |
| [`index.ts`](index.ts) | Profile, skills, experience, timeline, certifications, résumé summary/education |
| [`projects.ts`](projects.ts) | Projects |
| [`types.ts`](types.ts) | Field shapes only (when adding new fields) |

```
content/ ──► 2D directory
         ├──► 3D desk panels
         ├──► CRT terminal
         ├──► /resume (HTML)
         └──► /resume.pdf (generated for recruiters)
```

There is **no** hand-edited PDF in `public/`. Changing `content/` and redeploying
updates every surface, including the download.

## Order

Keep **timeline**, **experience**, and **certifications** newest-first (top = latest).

## Desk map

| Desk object | Export |
| ----------- | ------ |
| Monitor | `profile` |
| Keyboard | `skills` |
| Notebook | `resume` → `/resume` + `/resume.pdf` |
| Filing cabinet | `experience` |
| Coffee mug | `projects` |
| Desk phone | `profile.links` |
| Calendar | `timeline` |
| Badge | `certifications` |

## Workflow

1. Edit `content/index.ts` and/or `content/projects.ts`.
2. Commit and push (Vercel redeploys).
3. Hard-refresh if a browser tab looks cached.

## Adding a GitHub project

Paste a repo URL in chat; the agent appends one entry to [`projects.ts`](projects.ts).
