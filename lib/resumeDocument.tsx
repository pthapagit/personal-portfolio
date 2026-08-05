import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import {
  certifications,
  experience,
  profile,
  projects,
  resume,
  skills,
} from "@/content";

/**
 * Recruiter PDF layout — data only from `@/content`.
 * Edit content/index.ts + content/projects.ts; do not hardcode copy here.
 */

const s = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 42,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: "#26251e",
    lineHeight: 1.35,
  },
  name: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 3,
    fontSize: 10,
    color: "#3e5a44",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  meta: {
    marginTop: 6,
    fontSize: 8.5,
    color: "#5b5749",
  },
  section: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#d4cbb3",
    paddingTop: 8,
  },
  heading: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "#5b5749",
    marginBottom: 6,
  },
  jobTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  jobMeta: {
    fontSize: 8,
    color: "#5b5749",
    marginBottom: 3,
  },
  bullet: {
    marginLeft: 8,
    marginBottom: 2,
  },
  projectName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  muted: {
    fontSize: 8,
    color: "#5b5749",
    marginTop: 2,
  },
  link: {
    color: "#3e5a44",
    textDecoration: "none",
  },
});

export function ResumeDocument() {
  const contact = [
    profile.location,
    profile.links.email,
    profile.links.phone,
    profile.links.github.replace(/^https?:\/\//, ""),
    profile.links.linkedin?.replace(/^https?:\/\//, ""),
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <Document
      title={`${profile.name} — Résumé`}
      author={profile.name}
      subject={`${profile.title} résumé`}
    >
      <Page size="LETTER" style={s.page}>
        <Text style={s.name}>{profile.name}</Text>
        <Text style={s.title}>{profile.title}</Text>
        <Text style={s.meta}>{profile.tagline}</Text>
        <Text style={s.meta}>{contact}</Text>

        <View style={s.section}>
          <Text style={s.heading}>Summary</Text>
          {resume.summaryLines.map((line) => (
            <Text key={line} style={s.bullet}>
              • {line}
            </Text>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.heading}>Experience</Text>
          {experience.map((job) => (
            <View key={`${job.company}-${job.period}`} wrap={false} style={{ marginBottom: 8 }}>
              <Text style={s.jobTitle}>
                {job.role} · {job.company}
              </Text>
              <Text style={s.jobMeta}>
                {job.period}
                {job.location ? ` · ${job.location}` : ""}
              </Text>
              {job.highlights.map((hl) => (
                <Text key={hl} style={s.bullet}>
                  • {hl}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.heading}>Projects</Text>
          {projects.map((p) => (
            <View key={p.name} wrap={false} style={{ marginBottom: 6 }}>
              <Text style={s.projectName}>
                {p.link ? (
                  <Link src={p.link} style={s.link}>
                    {p.name}
                  </Link>
                ) : (
                  p.name
                )}{" "}
                ({p.status})
              </Text>
              <Text>{p.description}</Text>
              <Text style={s.muted}>{p.tech.join(" · ")}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.heading}>Skills</Text>
          {skills.map((g) => (
            <Text key={g.category} style={{ marginBottom: 3 }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{g.category}: </Text>
              {g.items.join(", ")}
            </Text>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.heading}>Education</Text>
          {resume.education.map((e) => (
            <View key={`${e.school}-${e.credential}`} style={{ marginBottom: 4 }}>
              <Text style={s.jobTitle}>{e.school}</Text>
              <Text style={s.jobMeta}>
                {e.credential} · {e.period}
              </Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.heading}>Certifications</Text>
          {certifications.map((c) => (
            <Text key={c.name} style={{ marginBottom: 3 }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{c.name}</Text>
              {" — "}
              {c.issuer} · {c.year}
              {c.credentialId ? ` · ID ${c.credentialId}` : ""}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
