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
          background: "linear-gradient(160deg, #251535 0%, #0d0610 100%)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            background: "#e8699a",
            transform: "rotate(45deg)",
            borderRadius: 12,
            boxShadow: "0 0 24px rgba(232,105,154,0.55)",
          }}
        />
        <div
          style={{
            fontSize: 34,
            letterSpacing: 6,
            color: "#fdf0f8",
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
