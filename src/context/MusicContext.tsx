"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MusicContextType {
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <MusicContext.Provider value={{ isVideoPlaying, setIsVideoPlaying }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusicContext must be used within MusicProvider");
  }
  return context;
}
