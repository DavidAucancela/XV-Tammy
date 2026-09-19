import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, verifyMagicLinkToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("token");
  const rawNext = searchParams.get("next") ?? "";
  const next = rawNext.startsWith("/") ? rawNext : "/admin";

  const base = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  const loginUrl = new URL("/login", base);

  const verified = token ? await verifyMagicLinkToken(token) : null;
  if (!verified) {
    loginUrl.searchParams.set("error", "expired");
    return NextResponse.redirect(loginUrl);
  }

  const sessionToken = await createSessionToken(verified.email);
  const res = NextResponse.redirect(new URL(next, base));
  res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
