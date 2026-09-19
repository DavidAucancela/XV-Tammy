import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { listGuestsOrdered } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const guests = await listGuestsOrdered();
  return NextResponse.json({ guests });
}
