"use client";

import { motion } from "framer-motion";
import { CSSProperties } from "react";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0 },
  },
};

const wordVariant = {
  hidden: { y: "115%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function RevealText({
  children,
  style,
  tag = "h2",
}: {
  children: string;
  style?: CSSProperties;
  tag?: Tag;
}) {
  const Tag = tag as Tag;
  const words = children.split(" ");

  return (
    <Tag style={{ ...style, margin: 0, overflow: "hidden" }}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-20px" }}
        style={{ display: "flex", flexWrap: "wrap", gap: "0.28em" }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
          >
            <motion.span variants={wordVariant} style={{ display: "inline-block" }}>
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
