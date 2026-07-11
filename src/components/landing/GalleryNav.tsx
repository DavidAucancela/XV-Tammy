"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Galería", href: "galeria" },
  { label: "Familia", href: "familia" },
  { label: "Evento", href: "evento" },
];

const SCROLLSPY_OFFSET = 120;

export default function GalleryNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(NAV_LINKS[0].href);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.65);

      let current = NAV_LINKS[0].href;
      for (const { href } of NAV_LINKS) {
        const el = document.getElementById(href);
        if (el && el.getBoundingClientRect().top - SCROLLSPY_OFFSET <= 0) {
          current = href;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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
        background: "rgba(var(--ink-rgb), 0.9)",
        borderBottom: "1px solid rgba(var(--accent-rgb), 0.18)",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--on-ink-muted)",
          textDecoration: "none",
        }}
      >
        Inicio
      </Link>

      {NAV_LINKS.map(({ label, href }) => {
        const isActive = active === href;
        return (
          <button
            key={href}
            onClick={() => scrollTo(href)}
            aria-current={isActive ? "true" : undefined}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              padding: "4px 0",
              cursor: "pointer",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: isActive ? "var(--accent)" : "var(--on-ink-muted)",
              fontFamily: "var(--font-lato), system-ui, sans-serif",
              transition: "color 0.25s",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "var(--on-ink)"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "var(--on-ink-muted)"; }}
          >
            {label}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -6,
                height: 1.5,
                borderRadius: 1,
                background: "var(--accent)",
                transform: isActive ? "scaleX(1)" : "scaleX(0)",
                opacity: isActive ? 1 : 0,
                transition: "transform 0.25s ease, opacity 0.25s ease",
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
