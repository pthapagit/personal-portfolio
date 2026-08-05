import { profile, sections } from "@/content";
import { getSectionContent } from "@/components/ui/sectionContent";

/**
 * The 2D "office floor directory" — server-rendered. This is the mobile /
 * reduced-motion / no-WebGL experience and the content crawlers index.
 */
export default function Directory2D() {
  return (
    <div id="directory" className="min-h-screen bg-paper text-ink">
      <header className="border-b-2 border-office-green bg-paper-dark">
        <div className="mx-auto flex max-w-3xl flex-col gap-1 px-5 py-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-ink-soft">Personnel file · read only</p>
          <h1 className="text-3xl font-semibold uppercase tracking-[0.2em]">{profile.name}</h1>
          <p className="font-mono text-sm uppercase tracking-[0.25em] text-office-green">{profile.title}</p>
          <p className="mt-3 max-w-xl text-ink-soft">{profile.tagline}</p>
        </div>
      </header>

      <nav aria-label="Sections" className="sticky top-0 z-10 border-b border-ink/15 bg-paper/95 backdrop-blur">
        <ul className="mx-auto flex max-w-3xl flex-wrap gap-x-2 px-4 py-1.5">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-block px-1.5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto max-w-3xl px-5 pb-24">
        {sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`} className="scroll-mt-16 border-b border-ink/10 py-10 last:border-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">In the office: {s.object}</p>
            <h2 id={`${s.id}-heading`} className="mb-4 mt-1 text-xl font-semibold uppercase tracking-[0.15em]">
              {s.label}
            </h2>
            <div className="leading-relaxed">{getSectionContent(s.id)}</div>
          </section>
        ))}
      </main>

      <footer className="border-t border-ink/15 bg-paper-dark py-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
        © {new Date().getFullYear()} {profile.name} · Built with Next.js & React Three Fiber
      </footer>
    </div>
  );
}
