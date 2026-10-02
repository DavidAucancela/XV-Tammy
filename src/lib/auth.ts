import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "session";

function secretKey() {
  return new TextEncoder().encode(process.env.AUTH_SECRET!);
}

export function isAllowedEmail(email: string): boolean {
  const allowed = (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

/** Token de un solo uso para el link mágico — vive 15 minutos. */
export async function createMagicLinkToken(email: string): Promise<string> {
  return new SignJWT({ email, purpose: "magic-link" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secretKey());
}

export async function verifyMagicLinkToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.purpose !== "magic-link" || typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

/** Cookie de sesión — vive 7 días. */
export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email, purpose: "session" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.purpose !== "session" || typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

/** Sesión del invitado en /recuerdos — cookie propia, vive 30 días. */
export const GUEST_COOKIE_NAME = "xv_guest";
export const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function createGuestSessionToken(guestId: string): Promise<string> {
  return new SignJWT({ guestId, purpose: "guest" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());
}

export async function verifyGuestSessionToken(token: string): Promise<{ guestId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.purpose !== "guest" || typeof payload.guestId !== "string") return null;
    return { guestId: payload.guestId };
  } catch {
    return null;
  }
}
