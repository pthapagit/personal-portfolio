import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  certifications,
  experience,
  profile,
  projects,
  resume,
  skills,
} from "@/content";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé for ${profile.name} — ${profile.title}. Generated from the same content as the portfolio.`,
};

/**
 * Print-friendly résumé built only from `content/`.
 * Keep this as a thin view — do not hardcode career copy here.
 */
export default function ResumePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-5 py-10 print:max-w-none print:px-0 print:py-0">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            ← Back to office
          </Link>
          <div className="flex flex-wrap gap-2">
            <PrintButton />
            {resume.downloadUrl && (
              <a
                href={resume.downloadUrl}
                className="border border-ink/40 px-3 py-1.5 font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper"
              >
                Download PDF
              </a>
            )}
          </div>
        </div>

        <header className="border-b-2 border-office-green pb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-ink-soft">Personnel file</p>
          <h1 className="mt-1 text-3xl font-semibold uppercase tracking-[0.15em]">{profile.name}</h1>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-office-green">{profile.title}</p>
          <p className="mt-2 text-ink-soft">{profile.tagline}</p>
          <p className="mt-3 font-mono text-xs text-ink-soft">
            {profile.location}
            {profile.links.email ? ` · ${profile.links.email}` : ""}
            {profile.links.phone ? ` · ${profile.links.phone}` : ""}
            {` · ${profile.links.github.replace("https://", "")}`}
          </p>
        </header>

        <Section title="Summary">
          <ul className="list-disc space-y-1 pl-5">
            {resume.summaryLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Section>

        <Section title="Experience">
          <div className="space-y-5">
            {experience.map((job) => (
              <div key={`${job.company}-${job.period}`}>
                <p className="font-medium">
                  {job.role} · {job.company}
                </p>
                <p className="mb-1 font-mono text-xs text-ink-soft">
                  {job.period}
                  {job.location ? ` · ${job.location}` : ""}
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {job.highlights.map((hl) => (
                    <li key={hl}>{hl}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Projects">
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p.name}>
                <p className="font-medium">
                  {p.link ? (
                    <a href={p.link} className="underline underline-offset-2">
                      {p.name}
                    </a>
                  ) : (
                    p.name
                  )}{" "}
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">({p.status})</span>
                </p>
                <p className="text-sm">{p.description}</p>
                <p className="mt-1 font-mono text-xs text-ink-soft">{p.tech.join(" · ")}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Skills">
          {skills.map((g) => (
            <p key={g.category} className="mb-2 text-sm">
              <span className="font-medium">{g.category}: </span>
              {g.items.join(", ")}
            </p>
          ))}
        </Section>

        <Section title="Education">
          {resume.education.map((e) => (
            <div key={`${e.school}-${e.credential}`} className="mb-2">
              <p className="font-medium">{e.school}</p>
              <p className="text-sm text-ink-soft">
                {e.credential} · {e.period}
              </p>
            </div>
          ))}
        </Section>

        <Section title="Certifications">
          <ul className="space-y-2">
            {certifications.map((c) => (
              <li key={c.name}>
                <p className="font-medium">{c.name}</p>
                <p className="font-mono text-xs text-ink-soft">
                  {c.issuer} · {c.year}
                  {c.credentialId ? ` · ID ${c.credentialId}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-ink/10 py-6 last:border-0">
      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-soft">{title}</h2>
      {children}
    </section>
  );
}
