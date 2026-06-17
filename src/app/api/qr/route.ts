import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token requerido" }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
  const url = `${base}/i/${token}`;

  const png = await QRCode.toBuffer(url, {
    type: "png",
    width: 400,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#fafafa" },
  });

  const isProd = process.env.NODE_ENV === "production";

  return new NextResponse(png as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": isProd
        ? "public, max-age=31536000, immutable"
        : "no-store",
    },
  });
}
