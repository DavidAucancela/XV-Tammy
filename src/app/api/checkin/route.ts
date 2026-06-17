import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token } = body as { token: string };

  if (!token) {
    return NextResponse.json({ error: "token requerido" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: guest, error: fetchError } = await supabase
    .from("guests")
    .select("id, nombre, pases, pases_confirmados, rsvp_estado, checked_in_at")
    .eq("token", token)
    .single();

  if (fetchError || !guest) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  const wasAlreadyCheckedIn = !!guest.checked_in_at;

  await supabase.rpc("check_in", { p_token: token });

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
