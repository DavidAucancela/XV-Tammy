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
  const [active, setActive] = useState(NAV_LINKS[0].href);

  useEffect(() => {
    const onScroll = () => {
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
      className="gallery-nav"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(var(--ink-rgb), 0.9)",
        borderBottom: "1px solid rgba(var(--accent-rgb), 0.18)",
      }}
    >
      {/* Always-available way back to the landing hero */}
      <Link
        href="/"
        className="gallery-nav-back"
        style={{
          display: "inline-flex",
          alignItems: "center",
          textTransform: "uppercase",
          color: "var(--on-ink)",
          textDecoration: "none",
          border: "1px solid var(--accent-soft)",
          borderRadius: "var(--radius-pill)",
          whiteSpace: "nowrap",
          transition: "border-color 0.25s, background 0.25s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.background = "rgba(var(--accent-rgb), 0.14)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-soft)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <svg
          aria-hidden
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.5 3 5.5 8l5 5" />
        </svg>
        Volver al inicio
      </Link>

      <div className="gallery-nav-links" style={{ display: "flex", alignItems: "center" }}>
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = active === href;
          return (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              aria-current={isActive ? "true" : undefined}
              className="gallery-nav-link"
              style={{
                position: "relative",
                background: "none",
                border: "none",
                padding: "4px 0",
                cursor: "pointer",
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
      </div>
    </nav>
  );
}
