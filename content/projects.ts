import type { Project } from "./types";

/**
 * Projects shown on the Coffee Mug / PROJECTS terminal command.
 * To add a GitHub repo: paste the URL in chat and ask the agent to append
 * an entry here (or edit this file directly).
 */
export const projects: Project[] = [
  {
    name: "Blink Monitor",
    description:
      "Serverless pipeline that polls Blink Sync Module XR SD-card motion clips and pushes them to Telegram — no Blink cloud subscription. AWS Lambda + EventBridge (~35–55s typical delivery); Terraform, Secrets Manager, and SSM for least-privilege ops.",
    tech: [
      "AWS Lambda",
      "EventBridge",
      "Terraform",
      "Python",
      "blinkpy",
      "Telegram",
      "Secrets Manager",
      "SSM",
    ],
    link: "https://github.com/pthapagit/blink-monitor",
    status: "shipped",
  },
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
    link: "https://github.com/pthapagit/personal-portfolio",
    status: "active",
  },
];
