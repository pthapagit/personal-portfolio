export type SectionId =
  | "about"
  | "skills"
  | "resume"
  | "experience"
  | "projects"
  | "contact"
  | "timeline"
  | "blog"
  | "certifications";

export interface SectionMeta {
  id: SectionId;
  /** Human label shown in panels, HUD and the 2D directory. */
  label: string;
  /** The desk object that opens this section in the 3D scene. */
  object: string;
  /** Short one-line description used in menus and SEO. */
  blurb: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  /** Paragraphs for the About section. */
  summary: string[];
  links: {
    github: string;
    linkedin?: string;
    email?: string;
    phone?: string;
  };
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location?: string;
  highlights: string[];
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  link?: string;
  status: "active" | "shipped" | "archived";
}

export interface TimelineEvent {
  year: string;
  title: string;
  detail: string;
}

export interface BlogPost {
  title: string;
  date: string;
  summary: string;
  link?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  link?: string;
}

export interface ResumeData {
  /** Optional hosted PDF, e.g. /resume.pdf placed in /public. */
  downloadUrl?: string;
  education: { school: string; credential: string; period: string }[];
  summaryLines: string[];
}
