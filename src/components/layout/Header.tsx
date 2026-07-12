import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSearch } from '../../hooks/useSearch';
import { Batch } from '../../types';
import {
  Menu,
  Search,
  LogOut,
  User,
  Home,
  X,
  Layers,
  BookOpen,
  PlayCircle,
} from 'lucide-react';

interface Props {
  batches: Batch[];
  onMenuClick: () => void;
}

export default function Header({ batches, onMenuClick }: Props) {
  const { user, logout } = useAuth();
  const { query, setQuery, results } = useSearch(batches);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Click outside handlers
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleResultClick = (result: (typeof results)[0]) => {
    setQuery('');
    setSearchFocused(false);
    if (result.type === 'lecture' && result.lectureId) {
      navigate(`/watch/${result.lectureId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const resultIcon = (type: string) => {
    switch (type) {
      case 'batch': return <Layers className="w-4 h-4 text-primary-400" />;
      case 'subject': return <BookOpen className="w-4 h-4 text-accent-400" />;
      case 'lecture': return <PlayCircle className="w-4 h-4 text-green-400" />;
      default: return null;
    }
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-surface-800/50">
      <div className="flex items-center gap-4 px-4 md:px-6 h-16">
        {/* Menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-surface-800/50 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Home button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-lg hover:bg-surface-800/50 transition-colors hidden md:flex"
        >
          <Home className="w-5 h-5 text-surface-400" />
        </button>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-xl relative">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
            searchFocused
              ? 'bg-surface-800/80 ring-2 ring-primary-500/30 border border-primary-500/20'
              : 'bg-surface-800/40 border border-surface-700/30'
          }`}>
            <Search className="w-4 h-4 text-surface-500 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search batches, subjects, lectures..."
              className="bg-transparent text-sm text-white placeholder:text-surface-500 outline-none w-full"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-surface-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchFocused && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden shadow-2xl max-h-80 overflow-y-auto">
              {results.map(result => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-800/50 transition-colors text-left"
                >
                  {resultIcon(result.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{result.title}</p>
                    <p className="text-xs text-surface-500 truncate">{result.subtitle}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-800/50 text-surface-400 capitalize flex-shrink-0">
                    {result.type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {searchFocused && query.length >= 2 && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl p-6 text-center shadow-2xl">
              <p className="text-sm text-surface-500">No results found for "{query}"</p>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-surface-800/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-surface-300 hidden md:block max-w-[100px] truncate">
              {user?.name || 'User'}
            </span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-64 glass rounded-xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-surface-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-surface-500">{user?.mobile}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user?.role === 'admin'
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                      : 'bg-surface-700/50 text-surface-400 border border-surface-600/20'
                  }`}>
                    {user?.role === 'admin' ? '👑 Admin' : '👤 Guest'}
                  </span>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { navigate('/dashboard'); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-800/50 transition-colors text-sm text-surface-300"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => { logout(); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
