import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1ead8",
          color: "#26251e",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: "6px solid #3e5a44",
            marginBottom: 40,
          }}
        />
        <div style={{ fontSize: 64, letterSpacing: 18, textTransform: "uppercase", fontWeight: 700 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 26, letterSpacing: 12, textTransform: "uppercase", color: "#3e5a44", marginTop: 16 }}>
          {profile.title}
        </div>
        <div style={{ fontSize: 18, letterSpacing: 6, textTransform: "uppercase", color: "#6b675a", marginTop: 44 }}>
          An explorable retro-corporate office
        </div>
      </div>
    ),
    { ...size }
  );
}
