import React, { createContext, useContext, useState, useCallback } from 'react';
import { Lecture, VideoServer, PlayerState } from '../types';
import { getAutoNext, setAutoNext as storeAutoNext } from '../utils/storage';

interface PlayerContextType extends PlayerState {
  setCurrentLecture: (lecture: Lecture | null) => void;
  setCurrentServer: (server: VideoServer | null) => void;
  setPlaylist: (lectures: Lecture[]) => void;
  toggleAutoNext: () => void;
  setIsFullscreen: (v: boolean) => void;
  getNextLecture: () => Lecture | null;
  getPrevLecture: () => Lecture | null;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentLecture: null,
    currentServer: null,
    playlist: [],
    autoNext: getAutoNext(),
    isFullscreen: false,
  });

  const setCurrentLecture = useCallback((lecture: Lecture | null) => {
    setState(prev => ({ ...prev, currentLecture: lecture }));
  }, []);

  const setCurrentServer = useCallback((server: VideoServer | null) => {
    setState(prev => ({ ...prev, currentServer: server }));
  }, []);

  const setPlaylist = useCallback((lectures: Lecture[]) => {
    setState(prev => ({ ...prev, playlist: lectures }));
  }, []);

  const toggleAutoNext = useCallback(() => {
    setState(prev => {
      const newVal = !prev.autoNext;
      storeAutoNext(newVal);
      return { ...prev, autoNext: newVal };
    });
  }, []);

  const setIsFullscreen = useCallback((v: boolean) => {
    setState(prev => ({ ...prev, isFullscreen: v }));
  }, []);

  const getNextLecture = useCallback((): Lecture | null => {
    if (!state.currentLecture || state.playlist.length === 0) return null;
    const idx = state.playlist.findIndex(l => l.id === state.currentLecture!.id);
    if (idx === -1 || idx === state.playlist.length - 1) return null;
    return state.playlist[idx + 1];
  }, [state.currentLecture, state.playlist]);

  const getPrevLecture = useCallback((): Lecture | null => {
    if (!state.currentLecture || state.playlist.length === 0) return null;
    const idx = state.playlist.findIndex(l => l.id === state.currentLecture!.id);
    if (idx <= 0) return null;
    return state.playlist[idx - 1];
  }, [state.currentLecture, state.playlist]);

  return (
    <PlayerContext.Provider value={{
      ...state,
      setCurrentLecture,
      setCurrentServer,
      setPlaylist,
      toggleAutoNext,
      setIsFullscreen,
      getNextLecture,
      getPrevLecture,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}
