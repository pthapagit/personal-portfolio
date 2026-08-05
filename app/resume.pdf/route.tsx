import { renderToBuffer } from "@react-pdf/renderer";
import { profile } from "@/content";
import { ResumeDocument } from "@/lib/resumeDocument";

/**
 * Recruiter PDF download — regenerated from `content/` on every request.
 * Edit content/index.ts + content/projects.ts; never hand-edit a binary PDF.
 */
export async function GET() {
  const buffer = await renderToBuffer(<ResumeDocument />);
  const filename = `${profile.name.replace(/\s+/g, "-")}-Resume.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
