import { PlaybackProgress, WatchHistory } from '../types';

const KEYS = {
  TOKEN: 'studystream_token',
  USER: 'studystream_user',
  PROGRESS: 'studystream_progress',
  HISTORY: 'studystream_history',
  SELECTED_SERVER: 'studystream_server',
  AUTO_NEXT: 'studystream_autonext',
  SIDEBAR_OPEN: 'studystream_sidebar',
  LAST_WATCHED: 'studystream_last_watched',
} as const;

// Token
export function getToken(): string | null {
  return localStorage.getItem(KEYS.TOKEN);
}

export function setToken(token: string): void {
  localStorage.setItem(KEYS.TOKEN, token);
}

export function removeToken(): void {
  localStorage.removeItem(KEYS.TOKEN);
}

// User
export function getStoredUser() {
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
}

export function setStoredUser(user: object): void {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function removeStoredUser(): void {
  localStorage.removeItem(KEYS.USER);
}

// Playback Progress
export function getPlaybackProgress(): Record<string, PlaybackProgress> {
  const data = localStorage.getItem(KEYS.PROGRESS);
  return data ? JSON.parse(data) : {};
}

export function setPlaybackProgress(lectureId: string, progress: PlaybackProgress): void {
  const all = getPlaybackProgress();
  all[lectureId] = progress;
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(all));
}

export function getProgress(lectureId: string): PlaybackProgress | null {
  const all = getPlaybackProgress();
  return all[lectureId] || null;
}

// Watch History
export function getWatchHistory(): WatchHistory[] {
  const data = localStorage.getItem(KEYS.HISTORY);
  return data ? JSON.parse(data) : [];
}

export function addToWatchHistory(entry: WatchHistory): void {
  let history = getWatchHistory();
  history = history.filter(h => h.lectureId !== entry.lectureId);
  history.unshift(entry);
  if (history.length > 50) history = history.slice(0, 50);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}

// Continue Watching (lectures with progress < 95%)
export function getContinueWatching(): PlaybackProgress[] {
  const progress = getPlaybackProgress();
  return Object.values(progress)
    .filter(p => p.percentage > 2 && p.percentage < 95)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20);
}

// Selected Server
export function getSelectedServer(lectureId: string): string | null {
  const data = localStorage.getItem(KEYS.SELECTED_SERVER);
  const servers: Record<string, string> = data ? JSON.parse(data) : {};
  return servers[lectureId] || null;
}

export function setSelectedServer(lectureId: string, serverId: string): void {
  const data = localStorage.getItem(KEYS.SELECTED_SERVER);
  const servers: Record<string, string> = data ? JSON.parse(data) : {};
  servers[lectureId] = serverId;
  localStorage.setItem(KEYS.SELECTED_SERVER, JSON.stringify(servers));
}

// Auto Next
export function getAutoNext(): boolean {
  return localStorage.getItem(KEYS.AUTO_NEXT) !== 'false';
}

export function setAutoNext(value: boolean): void {
  localStorage.setItem(KEYS.AUTO_NEXT, value.toString());
}

// Last Watched
export function getLastWatched(): string | null {
  return localStorage.getItem(KEYS.LAST_WATCHED);
}

export function setLastWatched(lectureId: string): void {
  localStorage.setItem(KEYS.LAST_WATCHED, lectureId);
}

// Sidebar
export function getSidebarOpen(): boolean {
  return localStorage.getItem(KEYS.SIDEBAR_OPEN) !== 'false';
}

export function setSidebarOpen(value: boolean): void {
  localStorage.setItem(KEYS.SIDEBAR_OPEN, value.toString());
}

// Clear all
export function clearAll(): void {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}
