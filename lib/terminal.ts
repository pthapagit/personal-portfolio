import {
  blogPosts,
  certifications,
  experience,
  profile,
  projects,
  resume,
  skills,
  timeline,
} from "@/content";
import { askAssistant } from "./assistant";

export interface TerminalResult {
  lines: string[];
  /** Special effects the UI should apply. */
  action?: "clear" | "exit";
}

const HELP_LINES = [
  "AVAILABLE COMMANDS",
  "------------------",
  "  HELP        show this list",
  "  ABOUT       personnel summary",
  "  PROJECTS    active assignments",
  "  SKILLS      technical proficiencies",
  "  RESUME      education & summary",
  "  EXPERIENCE  employment record",
  "  TIMELINE    career chronology",
  "  BLOG        published notes",
  "  CERTS       certifications on file",
  "  CONTACT     reach the employee",
  "  ASK <q>     query the department advisor",
  "  CLEAR       wipe the screen",
  "  EXIT        return to your desk",
];

export const BOOT_LINES = [
  "PT-OS v1.9 — PERSONNEL TERMINAL",
  `EMPLOYEE: ${profile.name.toUpperCase()}  //  ${profile.title.toUpperCase()}`,
  "CLEARANCE: VISITOR (READ ONLY)",
  "",
  'Type "HELP" for available commands.',
];

function aboutLines(): string[] {
  return [
    `${profile.name.toUpperCase()} — ${profile.title.toUpperCase()}`,
    `LOCATION: ${profile.location}`,
    "",
    ...profile.summary.flatMap((p) => wrap(p)),
  ];
}

function projectLines(): string[] {
  return projects.flatMap((p) => [
    `[${p.status.toUpperCase()}] ${p.name}`,
    ...wrap(p.description, "  "),
    `  STACK: ${p.tech.join(", ")}`,
    ...(p.link ? [`  LINK: ${p.link}`] : []),
    "",
  ]);
}

function skillLines(): string[] {
  return skills.flatMap((g) => [`${g.category.toUpperCase()}:`, ...wrap(g.items.join(", "), "  "), ""]);
}

function resumeLines(): string[] {
  return [
    "SUMMARY",
    ...resume.summaryLines.flatMap((l) => wrap(l, "  ")),
    "",
    "EDUCATION",
    ...resume.education.flatMap((e) => [`  ${e.school}`, `  ${e.credential} (${e.period})`]),
    ...(resume.downloadUrl ? ["", `PRINTABLE COPY: ${resume.downloadUrl}`] : []),
  ];
}

function experienceLines(): string[] {
  return experience.flatMap((e) => [
    `${e.role.toUpperCase()} — ${e.company}`,
    `  ${e.period}${e.location ? ` · ${e.location}` : ""}`,
    ...e.highlights.flatMap((h) => wrap(`- ${h}`, "  ")),
    "",
  ]);
}

function timelineLines(): string[] {
  return timeline.map((t) => `${t.year}  ${t.title} — ${t.detail}`).flatMap((l) => wrap(l));
}

function blogLines(): string[] {
  return blogPosts.flatMap((b) => [
    `${b.date}  ${b.title}`,
    ...wrap(b.summary, "  "),
    ...(b.link ? [`  ${b.link}`] : []),
    "",
  ]);
}

function certLines(): string[] {
  return certifications.map((c) => `${c.year}  ${c.name} — ${c.issuer}`);
}

function contactLines(): string[] {
  return [
    "DIRECT LINES",
    `  EMAIL:    ${profile.links.email ?? "on request"}`,
    ...(profile.links.phone ? [`  PHONE:    ${profile.links.phone}`] : []),
    `  GITHUB:   ${profile.links.github}`,
    ...(profile.links.linkedin ? [`  LINKEDIN: ${profile.links.linkedin}`] : []),
  ];
}

/** Naive word wrap so terminal output stays readable. */
function wrap(text: string, indent = "", width = 58): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = indent;
  for (const w of words) {
    if (current.length + w.length + 1 > width && current.trim().length > 0) {
      lines.push(current);
      current = indent;
    }
    current = current === indent ? indent + w : `${current} ${w}`;
  }
  if (current.trim().length > 0) lines.push(current);
  return lines;
}

export async function runCommand(raw: string): Promise<TerminalResult> {
  const input = raw.trim();
  if (!input) return { lines: [] };
  const [cmd, ...rest] = input.split(/\s+/);

  switch (cmd.toUpperCase()) {
    case "HELP":
      return { lines: HELP_LINES };
    case "ABOUT":
      return { lines: aboutLines() };
    case "PROJECTS":
      return { lines: projectLines() };
    case "SKILLS":
      return { lines: skillLines() };
    case "RESUME":
      return { lines: resumeLines() };
    case "EXPERIENCE":
      return { lines: experienceLines() };
    case "TIMELINE":
      return { lines: timelineLines() };
    case "BLOG":
      return { lines: blogLines() };
    case "CERTS":
    case "CERTIFICATIONS":
      return { lines: certLines() };
    case "CONTACT":
      return { lines: contactLines() };
    case "ASK": {
      const q = rest.join(" ");
      if (!q) return { lines: ["USAGE: ASK <your question>"] };
      const reply = await askAssistant(q);
      return { lines: reply.lines };
    }
    case "CLEAR":
      return { lines: [], action: "clear" };
    case "EXIT":
    case "QUIT":
      return { lines: ["Returning to desk..."], action: "exit" };
    default:
      return {
        lines: [`COMMAND NOT RECOGNIZED: ${cmd.toUpperCase()}`, 'Type "HELP" for available commands.'],
      };
  }
}
