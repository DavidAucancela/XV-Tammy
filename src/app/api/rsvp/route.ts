import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

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

  const supabase = createAdminClient();

  const { data: guest, error: fetchError } = await supabase
    .from("guests")
    .select("pases")
    .eq("token", token)
    .single();

  if (fetchError || !guest) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  if (accion === "confirmar" && pases_confirmados > guest.pases) {
    return NextResponse.json({ error: "Excede los pases disponibles" }, { status: 400 });
  }

  const update =
    accion === "confirmar"
      ? { rsvp_estado: "confirmado", pases_confirmados }
      : { rsvp_estado: "rechazado", pases_confirmados: 0 };

  const { error } = await supabase.from("guests").update(update).eq("token", token);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
