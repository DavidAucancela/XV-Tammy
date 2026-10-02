import { NextRequest, NextResponse } from "next/server";
import { insertRecuerdo, listRecuerdos } from "@/lib/db";
import { getGuestFromRequest } from "@/lib/guestSession";
import { MAX_BYTES, deleteObject, headObject, signDownload } from "@/lib/storage";

/** Lista los recuerdos con URLs firmadas de lectura (el bucket es privado). */
export async function GET(req: NextRequest) {
  if (!(await getGuestFromRequest(req))) {
    return NextResponse.json({ error: "Sin sesión" }, { status: 401 });
  }
  const rows = await listRecuerdos();
  const items = await Promise.all(rows.map(async (r) => ({ ...r, url: await signDownload(r.storage_key) })));
  return NextResponse.json({ items });
}

/** Registra un archivo ya subido al bucket, verificando que existe y respeta el tamaño. */
export async function POST(req: NextRequest) {
  const guest = await getGuestFromRequest(req);
  if (!guest) return NextResponse.json({ error: "Sin sesión" }, { status: 401 });
  const { key, contentType } = (await req.json()) as { key: string; contentType: string };
  if (!/^recuerdos\/[0-9a-f-]{36}\.\w+$/.test(key ?? "")) {
    return NextResponse.json({ error: "Clave inválida" }, { status: 400 });
  }

  const obj = await headObject(key);
  if (!obj) return NextResponse.json({ error: "No se encontró el archivo subido" }, { status: 404 });
  if (obj.size > MAX_BYTES) {
    await deleteObject(key);
    return NextResponse.json({ error: "Archivo demasiado grande" }, { status: 400 });
  }

  await insertRecuerdo({
    guest_id: guest.id,
    storage_key: key,
    tipo: contentType.startsWith("video/") ? "video" : "foto",
    content_type: contentType,
    size_bytes: obj.size,
  });
  return NextResponse.json({ ok: true });
}
