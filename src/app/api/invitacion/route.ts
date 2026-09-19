import { NextRequest, NextResponse } from "next/server";
import { findGuestByPhoneSuffix } from "@/lib/db";

// Busca la invitación asociada a un número de celular. Se compara por los
// 10 dígitos ingresados como sufijo del teléfono guardado (que puede tener
// código de país adelante), así que el formato no importa.
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

  const guest = await findGuestByPhoneSuffix(digits);
  if (!guest) {
    return NextResponse.json(
      { error: "No encontramos una invitación con ese número" },
      { status: 404 }
    );
  }

  return NextResponse.json({ token: guest.token, nombre: guest.nombre });
}
