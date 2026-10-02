import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getGuestByToken } from "@/lib/db";
import { MAX_BYTES, signUpload } from "@/lib/storage";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

export async function POST(req: NextRequest) {
  const { token, contentType, size } = (await req.json()) as { token: string; contentType: string; size: number };

  const ext = EXT[contentType];
  if (!token || !ext || typeof size !== "number" || size < 1 || size > MAX_BYTES) {
    return NextResponse.json({ error: "Archivo no permitido (JPG, PNG, WEBP, HEIC, MP4, MOV, WEBM; máx. 50MB)" }, { status: 400 });
  }

  const guest = await getGuestByToken(token);
  if (!guest) return NextResponse.json({ error: "Token inválido" }, { status: 404 });

  const key = `recuerdos/${randomUUID()}.${ext}`;
  const uploadUrl = await signUpload(key, contentType);
  return NextResponse.json({ key, uploadUrl });
}
