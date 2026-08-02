import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Busca la invitación asociada a un número de celular. Los números se
// comparan por sus últimos 9 dígitos (0991234567 ≡ +593 99 123 4567), así
// que el formato con que el invitado escribe su número no importa.
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
  const key = digits;

  const supabase = createAdminClient();
  const { data: guest, error } = await supabase
    .from("guests")
    .select("token, nombre")
    .like("telefono", `%${key}`)
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!guest) {
    return NextResponse.json(
      { error: "No encontramos una invitación con ese número" },
      { status: 404 }
    );
  }

  return NextResponse.json({ token: guest.token, nombre: guest.nombre });
}
