export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <p className="opacity-40">Invitación — token: {token}</p>
    </main>
  );
}
