"use client";

import { CSSProperties, ReactNode, useState } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  style?: CSSProperties;
};

/**
 * Text/label button. "primary" is reserved for the one action that matters
 * on a given screen (e.g. confirm attendance) — everything else uses
 * "secondary" so the primary keeps its weight.
 */
export function Button({ children, onClick, href, variant = "secondary", style }: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 30px",
    borderRadius: "var(--radius-pill)",
    fontSize: 11,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: "pointer",
    transition: `background var(--duration-fast) ease, color var(--duration-fast) ease, border-color var(--duration-fast) ease`,
    outline: focus ? "2px solid var(--accent)" : "none",
    outlineOffset: 2,
  };

  const variants: Record<string, CSSProperties> = {
    primary: {
      border: "1px solid var(--accent-ink)",
      background: "var(--accent-ink)",
      color: "var(--ivory)",
      fontWeight: 600,
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
    },
    secondary: {
      border: "1px solid var(--accent-soft)",
      background: hover ? "var(--accent-faint)" : "transparent",
      color: hover ? "var(--text)" : "var(--accent)",
    },
  };

  const combined = { ...base, ...variants[variant], ...style };

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={combined} {...handlers}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} style={combined} {...handlers}>
      {children}
    </button>
  );
}

type IconButtonProps = {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  size?: "sm" | "md";
  style?: CSSProperties;
};

/**
 * Circular "dark glass" control — arrows, mute, play/pause. Lives on the
 * --ink floating-widget layer, never on the page's light surface directly.
 * Never the primary action.
 */
export function IconButton({ children, label, onClick, size = "md", style }: IconButtonProps) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const dim = size === "sm" ? 38 : 46;

  return (
    <button
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: dim,
        height: dim,
        borderRadius: "50%",
        border: `1px solid ${hover ? "var(--accent)" : "var(--accent-soft)"}`,
        background: hover ? "rgba(var(--ink-rgb), 0.8)" : "rgba(var(--ink-rgb), 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "var(--on-ink)",
        fontSize: size === "sm" ? 14 : 18,
        lineHeight: 1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        outline: focus ? "2px solid var(--accent)" : "none",
        outlineOffset: 2,
        transition: `border-color var(--duration-fast) ease, background var(--duration-fast) ease`,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
