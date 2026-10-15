import Directory2D from "@/components/Directory2D";
import Experience from "@/components/Experience";

// Refresh the server-rendered 2D directory (incl. the latest-posts widget)
// periodically so new posts appear without a redeploy.
export const revalidate = 300;

export default function Home() {
  return (
    <Experience>
      <Directory2D />
    </Experience>
  );
}
