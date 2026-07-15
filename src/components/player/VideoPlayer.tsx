import { useState, useRef, useEffect } from 'react';
import { VideoServer } from '../../types';
import VideoWatermark from './VideoWatermark';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Maximize, Minimize } from 'lucide-react';

interface Props {
  server: VideoServer | null;
  onFullscreenToggle?: () => void;
}

export default function VideoPlayer({ server, onFullscreenToggle }: Props) {
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
  }, [server?.embedUrl]);

  const handleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
      onFullscreenToggle?.();
    } catch (err) {
      console.warn('Fullscreen failed:', err);
    }
  };

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  if (!server) {
    return (
      <div className="aspect-video bg-surface-900/50 rounded-2xl flex items-center justify-center">
        <p className="text-surface-500">Select a server to start watching</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-black overflow-hidden group ${
        isFullscreen ? 'w-screen h-screen rounded-none' : 'aspect-video rounded-2xl'
      }`}
    >
      {/* Loading overlay - Highest priority (z-50) */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-surface-400 text-sm animate-pulse">Loading video...</p>
        </div>
      )}

      {/* Video iframe - Base layer (z-10) */}
      {/* CRITICAL: allowFullScreen has been REMOVED so the iframe cannot hijack fullscreen */}
      <iframe
        src={server.embedUrl}
        className="absolute inset-0 w-full h-full z-10"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={() => setLoading(false)}
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        style={{ border: 'none' }}
      />

      {/* Watermark - Layered ABOVE the video (z-40) with pointer-events-none */}
      <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
        <VideoWatermark />
      </div>

      {/* Fullscreen button - Top layer (z-50) */}
      <button
        onClick={handleFullscreen}
        className="absolute top-3 right-3 z-50 p-2 rounded-lg bg-black/60 text-white/70 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-sm"
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </button>
    </div>
  );
}
