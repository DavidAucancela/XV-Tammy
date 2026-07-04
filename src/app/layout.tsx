import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { MusicProvider } from "@/context/MusicContext";
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
  title: "XV Años — Tammy Maguana Sánchez",
  description: "Te invitamos a celebrar los XV años de Tammy Maguana Sánchez",
  openGraph: {
    title: "XV Años — Tammy Maguana Sánchez",
    description: "Te invitamos a celebrar los XV años de Tammy Maguana Sánchez",
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
        <MusicProvider>
          {/* Every Framer Motion animation site-wide respects the OS reduced-motion
              setting from here — no need to check it per component. */}
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </MusicProvider>
      </body>
    </html>
  );
}
