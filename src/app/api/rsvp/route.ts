import { NextRequest, NextResponse } from "next/server";
import { getGuestByToken, updateRsvp } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, accion, pases_confirmados } = body as {
    token: string;
    accion: "confirmar" | "declinar";
    pases_confirmados: number;
  };

  if (!token || !["confirmar", "declinar"].includes(accion)) {
    return NextResponse.json({ error: "datos inválidos" }, { status: 400 });
  }

  if (accion === "confirmar" && (typeof pases_confirmados !== "number" || pases_confirmados < 1)) {
    return NextResponse.json({ error: "pases_confirmados inválido" }, { status: 400 });
  }

  const guest = await getGuestByToken(token);
  if (!guest) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  if (accion === "confirmar" && pases_confirmados > guest.pases) {
    return NextResponse.json({ error: "Excede los pases disponibles" }, { status: 400 });
  }

  await updateRsvp(token, accion === "confirmar" ? "confirmado" : "rechazado", accion === "confirmar" ? pases_confirmados : 0);

  return NextResponse.json({ ok: true });
}
