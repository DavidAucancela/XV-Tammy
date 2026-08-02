"use client";

import { motion } from "framer-motion";
import { CSSProperties, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  style?: CSSProperties;
};

export function Button({ children, onClick, href, variant = "secondary", style }: ButtonProps) {
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
    border: "none",
    ...style,
  };

  const variants: Record<string, CSSProperties> = {
    primary: {
      border: "1px solid var(--accent-ink)",
      background: "var(--accent-ink)",
      color: "var(--ivory)",
      fontWeight: 600,
    },
    secondary: {
      border: "1px solid var(--accent-soft)",
      background: "transparent",
      color: "var(--accent)",
    },
  };

  const combined = { ...base, ...variants[variant] };

  const motionProps = {
    whileHover: {
      scale: 1.05,
      boxShadow:
        variant === "primary"
          ? "0 12px 40px rgba(180, 112, 124, 0.25)"
          : "0 8px 24px rgba(180, 112, 124, 0.15)",
    },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2, ease: "easeOut" as const },
  };

  const content = <span>{children}</span>;

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={combined}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} style={combined} {...motionProps}>
      {content}
    </motion.button>
  );
}

type IconButtonProps = {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  size?: "sm" | "md";
  style?: CSSProperties;
};

export function IconButton({ children, label, onClick, size = "md", style }: IconButtonProps) {
  const dim = size === "sm" ? 38 : 46;

  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      whileHover={{
        backgroundColor: "rgba(var(--ink-rgb), 0.9)",
        boxShadow: "0 4px 16px rgba(180, 112, 124, 0.2)",
      }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.15, ease: "easeOut" as const }}
      style={{
        width: dim,
        height: dim,
        borderRadius: "50%",
        border: "1px solid var(--accent-soft)",
        background: "rgba(var(--ink-rgb), 0.65)",
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
        outline: "none",
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}
