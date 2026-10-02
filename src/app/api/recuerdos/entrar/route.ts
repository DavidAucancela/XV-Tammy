import { NextRequest, NextResponse } from "next/server";
import { getGuestByToken } from "@/lib/db";
import { setGuestCookie } from "@/lib/guestSession";

/** Entrada por link de invitación: valida el token, abre la sesión y manda a la sección de subida. */
export async function GET(req: NextRequest) {
  // En producción el origen interno del proxy no sirve; en local se queda en localhost.
  const base = process.env.NODE_ENV === "production" ? (process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin) : req.nextUrl.origin;
  const token = req.nextUrl.searchParams.get("t");
  const guest = token ? await getGuestByToken(token) : null;

  const res = NextResponse.redirect(new URL(guest ? "/recuerdos#recuerdos-compartidos" : "/recuerdos", base));
  if (guest) await setGuestCookie(res, guest.id);
  return res;
}
