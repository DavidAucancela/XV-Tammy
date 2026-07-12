import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          gap: 14,
          background: "linear-gradient(160deg, #F3E6D6 0%, #EAD8C3 100%)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            background: "linear-gradient(135deg, #C6A25E, #B4707C)",
            transform: "rotate(45deg)",
            borderRadius: 12,
            boxShadow: "0 0 24px rgba(180,112,124,0.4)",
          }}
        />
        <div
          style={{
            fontSize: 34,
            letterSpacing: 6,
            color: "#8F4E5F",
            fontFamily: "Georgia, serif",
          }}
        >
          XV
        </div>
      </div>
    ),
    { ...size }
  );
}
