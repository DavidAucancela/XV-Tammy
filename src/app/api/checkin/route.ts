import { NextRequest, NextResponse } from "next/server";
import { getGuestByToken, checkInGuest } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token } = body as { token: string };

  if (!token) {
    return NextResponse.json({ error: "token requerido" }, { status: 400 });
  }

  const guest = await getGuestByToken(token);
  if (!guest) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  const wasAlreadyCheckedIn = !!guest.checked_in_at;

  await checkInGuest(token);

  return NextResponse.json({
    ok: true,
    already_checked_in: wasAlreadyCheckedIn,
    guest: {
      nombre: guest.nombre,
      pases: guest.pases_confirmados ?? guest.pases,
      rsvp_estado: guest.rsvp_estado,
    },
  });
}
