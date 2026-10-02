import { NextRequest, NextResponse } from "next/server";
import { findGuestByPhoneSuffix, getGuestByToken } from "@/lib/db";
import { clearGuestCookie, getGuestFromRequest, setGuestCookie } from "@/lib/guestSession";

const firstName = (nombre: string) => nombre.trim().split(/\s+/)[0];

/** ¿Hay sesión de invitado? */
export async function GET(req: NextRequest) {
  const guest = await getGuestFromRequest(req);
  if (!guest) return NextResponse.json({ error: "Sin sesión" }, { status: 401 });
  return NextResponse.json({ nombre: firstName(guest.nombre) });
}

/** Abre sesión validando el celular (10 dígitos, igual que /api/invitacion). */
export async function POST(req: NextRequest) {
  let telefono: unknown;
  try {
    ({ telefono } = await req.json());
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const digits = typeof telefono === "string" ? telefono.replace(/\D/g, "") : "";
  if (digits.length !== 10) {
    return NextResponse.json({ error: "El número debe tener exactamente 10 dígitos" }, { status: 400 });
  }

  const found = await findGuestByPhoneSuffix(digits);
  const guest = found ? await getGuestByToken(found.token) : null;
  if (!guest) {
    return NextResponse.json({ error: "No encontramos una invitación con ese número" }, { status: 404 });
  }

  const res = NextResponse.json({ nombre: firstName(guest.nombre) });
  await setGuestCookie(res, guest.id);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearGuestCookie(res);
  return res;
}
