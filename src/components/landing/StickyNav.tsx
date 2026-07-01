"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Inicio", href: "inicio" },
  { label: "Galería", href: "galeria" },
  { label: "Familia", href: "familia" },
  { label: "Video", href: "video" },
  { label: "Evento", href: "evento" },
  { label: "Ubicación", href: "ubicacion" },
];

export default function StickyNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.65);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: "14px 24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(13, 6, 16, 0.88)",
        borderBottom: "1px solid rgba(232, 105, 154, 0.12)",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {NAV_LINKS.map(({ label, href }) => (
        <button
          key={href}
          onClick={() => scrollTo(href)}
          style={{
            background: "none",
            border: "none",
            padding: "4px 0",
            cursor: "pointer",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#7a5870",
            fontFamily: "var(--font-lato), system-ui, sans-serif",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#e8699a")}
          onMouseLeave={e => (e.currentTarget.style.color = "#7a5870")}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
