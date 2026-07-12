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
          background: "linear-gradient(160deg, #F3E6D6 0%, #EAD8C3 100%)",
        }}
      >
        <div
          style={{
            width: 15,
            height: 15,
            background: "linear-gradient(135deg, #C6A25E, #B4707C)",
            transform: "rotate(45deg)",
            borderRadius: 3,
            boxShadow: "0 0 6px rgba(180,112,124,0.5)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
