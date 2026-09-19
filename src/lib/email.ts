import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!);
  }
  return _resend;
}

export async function sendMagicLink(email: string, url: string) {
  const from = process.env.RESEND_FROM_EMAIL!;
  const { error } = await getResend().emails.send({
    from,
    to: email,
    subject: "Tu acceso al panel — XV Tammy",
    html: `
      <p>Entrá con este link (vence en 15 minutos):</p>
      <p><a href="${url}">${url}</a></p>
      <p>Si no pediste este acceso, ignorá este correo.</p>
    `,
  });
  if (error) throw new Error(error.message);
}
