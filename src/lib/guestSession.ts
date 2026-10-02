import type { NextRequest, NextResponse } from "next/server";
import { GUEST_COOKIE_MAX_AGE, GUEST_COOKIE_NAME, createGuestSessionToken, verifyGuestSessionToken } from "@/lib/auth";
import { getGuestById, type Guest } from "@/lib/db";

/** Invitado de la cookie de sesión. Se revalida contra la base: si se borró la invitación, la sesión deja de valer. */
export async function getGuestFromRequest(req: NextRequest): Promise<Guest | null> {
  const raw = req.cookies.get(GUEST_COOKIE_NAME)?.value;
  const session = raw ? await verifyGuestSessionToken(raw) : null;
  return session ? getGuestById(session.guestId) : null;
}

export async function setGuestCookie(res: NextResponse, guestId: string) {
  res.cookies.set(GUEST_COOKIE_NAME, await createGuestSessionToken(guestId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GUEST_COOKIE_MAX_AGE,
  });
}

export function clearGuestCookie(res: NextResponse) {
  res.cookies.set(GUEST_COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}
