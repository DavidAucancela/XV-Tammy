import { NextRequest, NextResponse } from "next/server";
import { createMagicLinkToken, isAllowedEmail } from "@/lib/auth";
import { sendMagicLink } from "@/lib/email";

export async function POST(req: NextRequest) {
  let email: unknown;
  let next: unknown;
  try {
    ({ email, next } = await req.json());
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  // No revelamos si el email está en la allowlist o no — misma respuesta siempre.
  if (isAllowedEmail(email)) {
    const token = await createMagicLinkToken(email);
    const nextPath = typeof next === "string" && next.startsWith("/") ? next : "/admin";
    const base = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
    const url = `${base}/auth/callback?token=${encodeURIComponent(token)}&next=${encodeURIComponent(nextPath)}`;
    await sendMagicLink(email, url);
  }

  return NextResponse.json({ ok: true });
}
