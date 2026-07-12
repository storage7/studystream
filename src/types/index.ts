export interface User {
  id: string;
  name: string;
  mobile: string;
  role: 'admin' | 'guest';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface VideoServer {
  id: string;
  name: string;
  embedUrl: string;
}

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  servers: VideoServer[];
  subjectId: string;
  batchId: string;
  order: number;
}

export interface Subject {
  id: string;
  name: string;
  icon?: string;
  batchId: string;
  lectures: Lecture[];
}

export interface Batch {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  subjects: Subject[];
}

export interface PlaybackProgress {
  lectureId: string;
  serverId: string;
  position: number;
  duration: number;
  percentage: number;
  timestamp: number;
  lectureTitle: string;
  subjectName: string;
  batchName: string;
  batchId: string;
  subjectId: string;
}

export interface WatchHistory {
  lectureId: string;
  timestamp: number;
  lectureTitle: string;
  subjectName: string;
  batchName: string;
  batchId: string;
  subjectId: string;
  thumbnail?: string;
  duration?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface PlayerState {
  currentLecture: Lecture | null;
  currentServer: VideoServer | null;
  playlist: Lecture[];
  autoNext: boolean;
  isFullscreen: boolean;
}
