import { ImageResponse } from "next/og";
import { getEventDetails } from "@/lib/eventDetails";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { celebrant, dateLabel } = getEventDetails();

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
          background: "linear-gradient(160deg, #F3E6D6 0%, #EAD8C3 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 15% 20%, rgba(180,112,124,0.25) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(198,162,94,0.28) 0%, transparent 45%)",
          }}
        />
        <div
          style={{
            width: 84,
            height: 84,
            background: "linear-gradient(135deg, #C6A25E, #B4707C)",
            transform: "rotate(45deg)",
            borderRadius: 18,
            boxShadow: "0 0 40px rgba(180,112,124,0.35)",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 30,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#8F4E5F",
            marginBottom: 18,
          }}
        >
          Los XV Años
        </div>
        <div
          style={{
            fontSize: 84,
            fontFamily: "Georgia, serif",
            color: "#4A372E",
            marginBottom: 24,
          }}
        >
          {`de ${celebrant}`}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#7A6355",
            textTransform: "capitalize",
          }}
        >
          {dateLabel}
        </div>
      </div>
    ),
    { ...size }
  );
}
