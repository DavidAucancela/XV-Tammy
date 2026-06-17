import { createAdminClient } from "@/lib/supabase/server";
import AdminClient from "./AdminClient";

export const metadata = { title: "Admin — XV" };

export const dynamic = "force-dynamic";

export type Guest = {
  id: string;
  nombre: string;
  pases: number;
  pases_confirmados: number | null;
  rsvp_estado: string | null;
  checked_in_at: string | null;
};

export default async function AdminPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("guests")
    .select("id, nombre, pases, pases_confirmados, rsvp_estado, checked_in_at")
    .order("created_at", { ascending: true });

  return <AdminClient initialGuests={(data as Guest[]) ?? []} />;
}
