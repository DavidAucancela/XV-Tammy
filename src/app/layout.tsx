import type { Metadata } from "next";
import { Playfair_Display, Lato, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { MusicProvider } from "@/context/MusicContext";
import PageTransition from "@/components/landing/PageTransition";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "XV Años — Tammy Maguana Sánchez",
  description: "Te invitamos a celebrar los XV años de Tammy Maguana Sánchez",
  openGraph: {
    title: "XV Años — Tammy Maguana Sánchez",
    description: "Te invitamos a celebrar los XV años de Tammy Maguana Sánchez",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "XV Años — Tammy Maguana Sánchez",
    description: "Te invitamos a celebrar los XV años de Tammy Maguana Sánchez",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <body className={`${playfair.variable} ${lato.variable}`}>
        <MusicProvider>
          {/* Every Framer Motion animation site-wide respects the OS reduced-motion
              setting from here — no need to check it per component. */}
          <MotionConfig reducedMotion="user">
            <PageTransition>{children}</PageTransition>
          </MotionConfig>
        </MusicProvider>
      </body>
    </html>
  );
}
