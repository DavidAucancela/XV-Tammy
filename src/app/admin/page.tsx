import { listGuestsOrdered } from "@/lib/db";
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
  const guests = await listGuestsOrdered();
  return <AdminClient initialGuests={guests} />;
}
