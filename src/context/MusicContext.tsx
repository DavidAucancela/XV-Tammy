"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MusicContextType {
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;
  musicRequested: boolean;
  requestMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [musicRequested, setMusicRequested] = useState(false);

  return (
    <MusicContext.Provider
      value={{
        isVideoPlaying,
        setIsVideoPlaying,
        musicRequested,
        requestMusic: () => setMusicRequested(true),
      }}
    >
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
