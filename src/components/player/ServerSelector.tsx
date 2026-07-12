import { VideoServer } from '../../types';
import { Server, Check } from 'lucide-react';

interface Props {
  servers: VideoServer[];
  currentServer: VideoServer | null;
  onSelect: (server: VideoServer) => void;
}

export default function ServerSelector({ servers, currentServer, onSelect }: Props) {
  if (servers.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Server className="w-4 h-4 text-surface-500 flex-shrink-0" />
      <span className="text-sm text-surface-400 mr-1">Server:</span>
      {servers.map(server => (
        <button
          key={server.id}
          onClick={() => onSelect(server)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
            ${currentServer?.id === server.id
              ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
              : 'bg-surface-800/50 text-surface-400 border border-surface-700/30 hover:bg-surface-800/80 hover:text-white'
            }`}
        >
          {currentServer?.id === server.id && <Check className="w-3 h-3" />}
          {server.name}
        </button>
      ))}
    </div>
  );
}
