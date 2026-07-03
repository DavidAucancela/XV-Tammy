import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #251535 0%, #0d0610 100%)",
        }}
      >
        <div
          style={{
            width: 15,
            height: 15,
            background: "#e8699a",
            transform: "rotate(45deg)",
            borderRadius: 3,
            boxShadow: "0 0 6px rgba(232,105,154,0.7)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
