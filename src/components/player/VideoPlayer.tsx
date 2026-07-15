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
      className="relative aspect-video bg-black rounded-2xl overflow-hidden group"
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-surface-400 text-sm animate-pulse">Loading video...</p>
        </div>
      )}

      {/* Watermark */}
      <VideoWatermark />

      {/* Video iframe */}
      <iframe
        src={server.embedUrl}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={() => setLoading(false)}
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        style={{ border: 'none' }}
      />

      {/* Fullscreen button */}
      <button
        onClick={handleFullscreen}
        className="absolute top-3 right-3 z-20 p-2 rounded-lg bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </button>
    </div>
  );
}
