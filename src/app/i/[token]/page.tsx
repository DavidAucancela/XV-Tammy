import { getGuestByToken } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import InvitationClient from "./InvitationClient";

type Props = { params: Promise<{ token: string }> };

async function fetchGuest(token: string) {
  return getGuestByToken(token);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const guest = await fetchGuest(token);
  const celebrant = process.env.NEXT_PUBLIC_CELEBRANT_NAME ?? "XV Años";

  if (!guest) return { title: "Invitación" };

  const pases = guest.pases === 1 ? "1 pase" : `${guest.pases} pases`;

  return {
    title: `Invitación para ${guest.nombre}`,
    description: `Estás invitado a los XV años de ${celebrant}. Tienes ${pases} reservado${guest.pases > 1 ? "s" : ""}.`,
    openGraph: {
      title: `✨ Invitación para ${guest.nombre}`,
      description: `Celebremos juntos los XV años de ${celebrant}`,
      type: "website",
    },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { token } = await params;
  const guest = await fetchGuest(token);

  if (!guest) notFound();

  return <InvitationClient guest={guest} token={token} />;
}
