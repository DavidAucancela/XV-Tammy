"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AccordionContextType {
  openPanels: Set<string>;
  isOpen: (id: string) => boolean;
  togglePanel: (id: string) => void;
  openPanel: (id: string) => void;
  closePanel: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

export function RecuerdosAccordionProvider({ children }: { children: ReactNode }) {
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set());

  const isOpen = (id: string) => openPanels.has(id);

  const togglePanel = (id: string) => {
    setOpenPanels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openPanel = (id: string) => {
    setOpenPanels((prev) => new Set(prev).add(id));
  };

  const closePanel = (id: string) => {
    setOpenPanels((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ openPanels, isOpen, togglePanel, openPanel, closePanel }}>
      {children}
    </AccordionContext.Provider>
  );
}

export function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("useAccordion must be used within RecuerdosAccordionProvider");
  }
  return ctx;
}
