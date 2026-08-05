import type {
  BlogPost,
  Certification,
  ExperienceItem,
  Profile,
  Project,
  ResumeData,
  SectionMeta,
  SkillGroup,
  TimelineEvent,
} from "./types";

/**
 * All portfolio content lives in this folder.
 * Sourced from LinkedIn profile (Profile.pdf) and GitHub.
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
    email: "nepalichoro2012@gmail.com",
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
  { id: "blog", label: "Blog", object: "Window" },
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
    ],
  },
  {
    category: "Frontend & Data",
    items: ["React", "MongoDB", "Db2", "IMS", "Tableau"],
  },
  {
    category: "AppSec & Quality",
    items: ["BlackDuck", "Snyk", "SonarQube", "Selenium", "Postman", "NVD API"],
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

export const projects: Project[] = [
  {
    name: "COBOL → Java modernization (TSYS)",
    description:
      "Enterprise legacy modernization: converting COBOL programs into Spring Boot microservices with AI-assisted analysis, business-rule validation, and AWS deployment. 50+ programs migrated at 98% functional accuracy.",
    tech: ["Java", "Spring Boot", "COBOL", "AWS EKS", "Docker", "Helm", "Cursor Agents"],
    status: "active",
  },
  {
    name: "RAG documentation chat",
    description:
      "Grounded Q&A over documentation and code context using LangChain, embeddings, and PostgreSQL pgvector — built to support modernization workflows with accurate, citeable answers.",
    tech: ["LangChain", "RAG", "PostgreSQL pgvector", "Python", "Embeddings"],
    status: "active",
  },
  {
    name: "This portfolio",
    description:
      "An explorable retro-corporate office built with React Three Fiber — the site you are looking at right now.",
    tech: ["Next.js", "TypeScript", "React Three Fiber", "GSAP", "Tailwind CSS"],
    link: "https://github.com/PrabeshThapa",
    status: "active",
  },
  {
    name: "ecab_passenger",
    description: "Passenger-side application for an e-cab ride-hailing service, built in TypeScript.",
    tech: ["TypeScript"],
    link: "https://github.com/PrabeshThapa/ecab_passenger",
    status: "shipped",
  },
];

export const timeline: TimelineEvent[] = [
  {
    year: "2017–2018",
    title: "North Lake College",
    detail: "Associate degrees in Business Administration and Management.",
  },
  {
    year: "2019–2021",
    title: "UT Arlington",
    detail: "Bachelor's in Information Management Systems.",
  },
  {
    year: "2021",
    title: "Joined TCS",
    detail: "Started as Software Engineer building full-stack apps and CI/CD to AWS.",
  },
  {
    year: "2022",
    title: "Citi · AppSec",
    detail: "Application Security Engineer — vulnerability management across 15+ teams.",
  },
  {
    year: "2025",
    title: "TSYS modernization",
    detail: "Modernization Engineer converting COBOL to Spring Boot with GenAI/RAG workflows.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    title: "Cutting COBOL analysis from 8 hours to 2 with Cursor agents",
    date: "2025",
    summary:
      "How prompt engineering, context windowing, and chunked retrieval turned agentic workflows into a 75% faster path through legacy code — with first-pass acceptance up to 92%.",
  },
  {
    title: "Why my portfolio is an office you walk into",
    date: "2026",
    summary:
      "Notes on building a cinematic 3D portfolio with React Three Fiber without shipping a single downloaded asset.",
  },
];

export const certifications: Certification[] = [
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
    "Core stack: Java, Spring Boot, Python, LangChain, AWS, Docker, Jenkins, SQL.",
  ],
};
