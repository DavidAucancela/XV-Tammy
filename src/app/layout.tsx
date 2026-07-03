import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XV Años — Tammy",
  description: "Te invitamos a celebrar los XV años de Tammy",
  openGraph: {
    title: "XV Años — Tammy",
    description: "Te invitamos a celebrar los XV años de Tammy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${lato.variable}`}>
        {/* Every Framer Motion animation site-wide respects the OS reduced-motion
            setting from here — no need to check it per component. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
