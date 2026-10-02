import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getGuestFromRequest } from "@/lib/guestSession";
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
  const guest = await getGuestFromRequest(req);
  if (!guest) return NextResponse.json({ error: "Sin sesión" }, { status: 401 });

  const { contentType, size } = (await req.json()) as { contentType: string; size: number };

  const ext = EXT[contentType];
  if (!ext || typeof size !== "number" || size < 1 || size > MAX_BYTES) {
    return NextResponse.json({ error: "Archivo no permitido (JPG, PNG, WEBP, HEIC, MP4, MOV, WEBM; máx. 50MB)" }, { status: 400 });
  }

  const key = `recuerdos/${randomUUID()}.${ext}`;
  const uploadUrl = await signUpload(key, contentType);
  return NextResponse.json({ key, uploadUrl });
}
