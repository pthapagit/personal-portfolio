import type { ReactNode } from "react";
import type { SectionId } from "@/content/types";
import {
  certifications,
  experience,
  profile,
  projects,
  resume,
  skills,
  timeline,
} from "@/content";

/**
 * Section bodies shared by the 3D overlay panels and the 2D directory.
 * Server-safe: no hooks, no browser APIs.
 */

const h3 = "font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-2 mt-5 first:mt-0";

export function getSectionContent(id: SectionId): ReactNode {
  switch (id) {
    case "about":
      return (
        <div className="space-y-3">
          {profile.summary.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      );

    case "skills":
      return (
        <div>
          {skills.map((g) => (
            <div key={g.category}>
              <h3 className={h3}>{g.category}</h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s} className="rounded-sm border border-ink/20 bg-paper-dark px-2 py-0.5 font-mono text-xs">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "resume":
      return (
        <div>
          <h3 className={h3}>Summary</h3>
          <ul className="list-disc space-y-1 pl-5">
            {resume.summaryLines.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
          <h3 className={h3}>Education</h3>
          {resume.education.map((e) => (
            <div key={e.school} className="mb-2">
              <p className="font-medium">{e.school}</p>
              <p className="text-sm text-ink-soft">
                {e.credential} · {e.period}
              </p>
            </div>
          ))}
          {resume.downloadUrl && (
            <a
              href={resume.downloadUrl}
              className="mt-4 inline-block border border-ink/40 px-3 py-1.5 font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper"
            >
              Download PDF
            </a>
          )}
        </div>
      );

    case "experience":
      return (
        <div className="space-y-5">
          {experience.map((e) => (
            <div key={`${e.company}-${e.period}`}>
              <p className="font-medium">
                {e.role} · {e.company}
              </p>
              <p className="mb-1 font-mono text-xs text-ink-soft">
                {e.period}
                {e.location ? ` · ${e.location}` : ""}
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {e.highlights.map((hl, i) => (
                  <li key={i}>{hl}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "projects":
      return (
        <div className="space-y-5">
          {projects.map((p) => (
            <div key={p.name}>
              <p className="font-medium">
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/30 underline-offset-2 hover:decoration-ink">
                    {p.name}
                  </a>
                ) : (
                  p.name
                )}{" "}
                <span className="ml-1 rounded-sm border border-ink/20 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                  {p.status}
                </span>
              </p>
              <p className="text-sm">{p.description}</p>
              <p className="mt-1 font-mono text-xs text-ink-soft">{p.tech.join(" · ")}</p>
            </div>
          ))}
        </div>
      );

    case "contact":
      return (
        <div className="space-y-2">
          <p>The direct lines, no switchboard required:</p>
          <ul className="space-y-1 font-mono text-sm">
            {profile.links.email && (
              <li>
                EMAIL —{" "}
                <a className="underline underline-offset-2" href={`mailto:${profile.links.email}`}>
                  {profile.links.email}
                </a>
              </li>
            )}
            {profile.links.phone && (
              <li>
                PHONE —{" "}
                <a className="underline underline-offset-2" href={`tel:${profile.links.phone.replace(/\D/g, "")}`}>
                  {profile.links.phone}
                </a>
              </li>
            )}
            <li>
              GITHUB —{" "}
              <a className="underline underline-offset-2" href={profile.links.github} target="_blank" rel="noopener noreferrer">
                {profile.links.github.replace("https://", "")}
              </a>
            </li>
            {profile.links.linkedin && (
              <li>
                LINKEDIN —{" "}
                <a className="underline underline-offset-2" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                  {profile.links.linkedin.replace("https://", "")}
                </a>
              </li>
            )}
          </ul>
        </div>
      );

    case "timeline":
      return (
        <ol className="relative space-y-4 border-l border-ink/20 pl-5">
          {timeline.map((t, i) => (
            <li key={i}>
              <span className="absolute -left-[5px] mt-1.5 block h-2.5 w-2.5 rounded-full bg-office-green" />
              <p className="font-mono text-xs text-ink-soft">{t.year}</p>
              <p className="font-medium">{t.title}</p>
              <p className="text-sm">{t.detail}</p>
            </li>
          ))}
        </ol>
      );

    case "certifications":
      return (
        <ul className="space-y-3">
          {certifications.map((c) => (
            <li key={c.name}>
              <p className="font-medium">{c.name}</p>
              <p className="font-mono text-xs text-ink-soft">
                {c.issuer} · {c.year}
                {c.credentialId ? ` · ID ${c.credentialId}` : ""}
              </p>
              {c.link && (
                <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-2">
                  Verify
                </a>
              )}
            </li>
          ))}
        </ul>
      );
  }
}
