import { ImageResponse } from "next/og";

export const alt = "Ilmefy — Find Your Perfect Tutor";
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
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #1a120d 0%, #2a1810 50%, #1a120d 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#ec5b13",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Ilmefy
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 76,
            fontWeight: 900,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Get unstuck. Learn instantly.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "#d1d5db",
            maxWidth: 900,
          }}
        >
          Book expert tutors for focused 1-on-1 help — pay per session.
        </div>
      </div>
    ),
    { ...size },
  );
}
