import type {
  Certification,
  ExperienceItem,
  Profile,
  ResumeData,
  SectionMeta,
  SkillGroup,
  TimelineEvent,
} from "./types";

export type {
  Certification,
  ExperienceItem,
  Profile,
  Project,
  ResumeData,
  SectionId,
  SectionMeta,
  SkillGroup,
  TimelineEvent,
} from "./types";

export { projects } from "./projects";

/**
 * Single source of truth for portfolio copy.
 * 2D directory, 3D panels, terminal, and /resume all read from here
 * (see content/README.md). Do not duplicate this data in components.
 */

export const profile: Profile = {
  name: "Prabesh Thapa",
  title: "Software Engineer",
  tagline: "Java · Spring Boot · GenAI/RAG · Legacy modernization · AppSec",
  location: "Atlanta, Georgia, United States",
  summary: [
    "Software Engineer with 4+ years building and modernizing enterprise systems in financial services — and using GenAI to ship that work faster without sacrificing correctness.",
    "Today at TCS (client: TSYS / Global Payments), I convert legacy COBOL into Java Spring Boot services, validate business rules with cross-team testing, and build AI-assisted workflows that cut manual code analysis from 8 hours to about 2 hours per module. I also built a RAG chat system with LangChain, embeddings, and PostgreSQL pgvector for grounded Q&A over documentation and code context.",
    "Before that, I spent 2.5 years as an Application Security Engineer supporting Citi Group: vulnerability management across 15+ application teams, Python automation that correlated NVD data with BlackDuck/Snyk findings, and Tableau dashboards that turned risk data into KPIs for 50+ applications.",
    "Open to Full Stack Software Engineer / Backend Engineer roles in financial services, insurance, and healthcare.",
  ],
  links: {
    github: "https://github.com/PrabeshThapa",
    linkedin: "https://www.linkedin.com/in/prabeshthapa97",
    email: "Pthapatwenty21@gmail.com",
    phone: "+1 (682) 347-6526",
  },
};

export const sections: SectionMeta[] = [
  { id: "about", label: "About Me", object: "Computer Monitor" },
  { id: "skills", label: "Technical Skills", object: "Keyboard" },
  { id: "resume", label: "Resume", object: "Notebook" },
  { id: "experience", label: "Work Experience", object: "Filing Cabinet" },
  { id: "projects", label: "Current Projects", object: "Coffee Mug" },
  { id: "contact", label: "Contact", object: "Desk Phone" },
  { id: "timeline", label: "Career Timeline", object: "Calendar" },
  { id: "certifications", label: "Certifications", object: "Employee Badge" },
];

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Java", "Python", "JavaScript", "SQL", "COBOL"],
  },
  {
    category: "Backend & APIs",
    items: ["Spring Boot", "Node.js", "Express", "REST APIs", "JWT Auth"],
  },
  {
    category: "GenAI & RAG",
    items: [
      "LangChain",
      "Retrieval-Augmented Generation (RAG)",
      "PostgreSQL pgvector",
      "Prompt Engineering",
      "Cursor IDE Agents",
      "GitHub Copilot",
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      "AWS (EKS, Lambda, S3, EC2, API Gateway, Step Functions)",
      "Docker",
      "Helm",
      "Jenkins",
      "GitLab CI/CD",
      "Apache Airflow",
      "Maven",
      "Gradle",
    ],
  },
  {
    category: "Frontend & Data",
    items: ["React", "MongoDB", "Db2", "IMS", "Tableau"],
  },
  {
    category: "AppSec & Quality",
    items: ["BlackDuck", "Snyk", "SonarQube", "Postman", "NVD API"],
  },
];

export const experience: ExperienceItem[] = [
  {
    company: "Tata Consultancy Services (Client: TSYS / Global Payments)",
    role: "Modernization Engineer",
    period: "January 2025 — Present",
    location: "Alpharetta, Georgia, United States",
    highlights: [
      "Converted 50+ legacy COBOL programs into Java Spring Boot microservices with RESTful APIs, orchestrating data migration across Db2, IMS, and VSAM/QSAM stores with 98% functional accuracy across 200+ business rules.",
      "Built custom AI agents in Cursor IDE that ingest legacy COBOL documentation and parse business rule specifications — reducing manual code analysis from 8 hours to under 2 hours per module (75% faster).",
      "Optimized agentic workflows through prompt engineering, context windowing, and chunked retrieval — cutting LLM token usage by 55% per cycle while improving first-pass code acceptance from 65% to 92%.",
      "Deployed containerized microservices via Docker and Helm to AWS EKS; leveraged Lambda, API Gateway, S3, and Step Functions — reducing release cycles from 2 weeks to 3 days.",
      "Built Jenkins and GitLab CI/CD pipelines with trunk-based development; integrated Apache Airflow for workflow orchestration across environments.",
      "Mentored 2 junior engineers on agentic development practices in Agile sprints.",
    ],
  },
  {
    company: "Citi",
    role: "Application Security Engineer",
    period: "July 2022 — January 2025",
    location: "United States",
    highlights: [
      "Led vulnerability management across 15+ application teams, improving remediation efficiency by 20% and reducing mean-time-to-patch by 1 month.",
      "Developed a Python script to fetch and correlate NVD data, proactively identifying vulnerabilities before they surfaced in BlackDuck and Snyk — reducing exposure windows by weeks.",
      "Integrated automated scanning into CI/CD pipelines (Jenkins, SonarQube, BlackDuck), reducing manual review effort by 25% across the application portfolio.",
      "Built executive-level security dashboards in Tableau translating vulnerability data into actionable KPIs for 50+ enterprise applications.",
    ],
  },
  {
    company: "Tata Consultancy Services",
    role: "Software Engineer",
    period: "November 2021 — January 2025",
    location: "United States",
    highlights: [
      "Built full-stack web applications using JavaScript (React, Node.js, Express, MongoDB) with RESTful APIs, JWT-based authentication, and Python backend services (prior to the current TSYS modernization assignment).",
      "Engineered end-to-end CI/CD pipelines with Jenkins, Docker, and Maven for automated deployment to AWS EC2, reducing deployment time by 60%.",
      "Developed automated testing frameworks using Selenium and Postman, achieving 80% test coverage and eliminating 15+ hours/week of manual regression testing.",
      "Fine-tuned an image classification model using Python and Fast.ai, achieving 92% accuracy and documenting the process as a reusable training guide.",
    ],
  },
];

/** Newest first — both 2D directory and 3D calendar render this array as-is. */
export const timeline: TimelineEvent[] = [
  {
    year: "2025",
    title: "TSYS modernization",
    detail: "Modernization Engineer converting COBOL to Spring Boot with GenAI/RAG workflows.",
  },
  {
    year: "2022",
    title: "Citi · AppSec",
    detail: "Application Security Engineer — vulnerability management across 15+ teams.",
  },
  {
    year: "2021",
    title: "Joined TCS",
    detail: "Started as Software Engineer building full-stack apps and CI/CD to AWS.",
  },
  {
    year: "2019–2021",
    title: "UT Arlington",
    detail: "Bachelor's in Information Management Systems.",
  },
  {
    year: "2017–2018",
    title: "North Lake College",
    detail: "Associate degrees in Business Administration and Management.",
  },
];

export const certifications: Certification[] = [
  {
    name: "Academy Accreditation — Generative AI Fundamentals",
    issuer: "Databricks",
    year: "Aug 2026",
    credentialId: "190713791",
  },
  {
    name: "Become a CompTIA Security+ Certified Security Professional",
    issuer: "CompTIA / LinkedIn Learning",
    year: "—",
  },
  {
    name: "Hootsuite Platform Certification",
    issuer: "Hootsuite",
    year: "—",
  },
  {
    name: "Social Marketing Certification",
    issuer: "Hootsuite",
    year: "—",
  },
  {
    name: "Learning Impact: The Importance of Storytelling",
    issuer: "LinkedIn Learning",
    year: "—",
  },
];

export const resume: ResumeData = {
  /** HTML résumé page — same data as the PDF. */
  viewUrl: "/resume",
  /** Generated on demand from this folder (see app/resume.pdf/route.tsx). */
  downloadUrl: "/resume.pdf",
  education: [
    {
      school: "University of Texas at Arlington",
      credential: "Bachelor's degree, Information Management Systems",
      period: "2019 — 2021",
    },
    {
      school: "North Lake College",
      credential: "Associate of Science — Business Administration and Management",
      period: "2017 — 2018",
    },
    {
      school: "North Lake College",
      credential: "Associate of Arts and Sciences — Business Administration and Management",
      period: "—",
    },
  ],
  summaryLines: [
    "Software Engineer with 4+ years in financial services: Java/Spring Boot modernization, GenAI/RAG, and AppSec (ex-Citi).",
    "Currently modernizing COBOL → cloud at TCS for TSYS / Global Payments; previously AppSec at Citi.",
    "Core stack: Java, Spring Boot, Python, LangChain, AWS, Docker, Jenkins, SQL · open-source: Blink Monitor.",
  ],
};
