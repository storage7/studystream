import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Batch, Lecture, VideoServer } from '../types';
import { fetchLecture } from '../utils/api';
import {
  getSelectedServer,
  setSelectedServer,
  addToWatchHistory,
  setLastWatched,
  setPlaybackProgress,
} from '../utils/storage';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import VideoPlayer from '../components/player/VideoPlayer';
import ServerSelector from '../components/player/ServerSelector';
import PlaylistPanel from '../components/player/PlaylistPanel';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  SkipBack,
  SkipForward,
  ListVideo,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
} from 'lucide-react';

interface OutletCtx {
  batches: Batch[];
  loading: boolean;
}

export default function WatchPage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();
  const { batches } = useOutletContext<OutletCtx>();
  const { addToast } = useToast();
  const {
    autoNext,
    toggleAutoNext,
    setPlaylist,
    getNextLecture,
    getPrevLecture,
    setCurrentLecture,
  } = usePlayer();

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [currentServer, setCurrentServerState] = useState<VideoServer | null>(null);
  const [playlistLectures, setPlaylistLectures] = useState<Lecture[]>([]);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [subjectName, setSubjectName] = useState('');
  const [batchName, setBatchName] = useState('');

  // Load lecture data
  const loadLecture = useCallback(async (id: string) => {
    try {
      setPageLoading(true);
      const data = await fetchLecture(id);
      const lec = data.lecture as Lecture;
      setLecture(lec);
      setCurrentLecture(lec);

      // Select server
      const savedServerId = getSelectedServer(id);
      const server = lec.servers.find(s => s.id === savedServerId) || lec.servers[0] || null;
      setCurrentServerState(server);

      // Find batch and subject from batches data
      let foundSubject = '';
      let foundBatch = '';
      let foundPlaylist: Lecture[] = [];

      for (const batch of batches) {
        for (const subject of batch.subjects) {
          const found = subject.lectures.find(l => l.id === id);
          if (found) {
            foundSubject = subject.name;
            foundBatch = batch.name;
            foundPlaylist = subject.lectures;
            break;
          }
        }
        if (foundSubject) break;
      }

      setSubjectName(foundSubject);
      setBatchName(foundBatch);
      setPlaylistLectures(foundPlaylist);
      setPlaylist(foundPlaylist);

      // Update history
      setLastWatched(id);
      addToWatchHistory({
        lectureId: id,
        timestamp: Date.now(),
        lectureTitle: lec.title,
        subjectName: foundSubject,
        batchName: foundBatch,
        batchId: lec.batchId,
        subjectId: lec.subjectId,
        thumbnail: lec.thumbnail,
        duration: lec.duration,
      });

      // Save basic progress
      setPlaybackProgress(id, {
        lectureId: id,
        serverId: server?.id || '',
        position: 0,
        duration: 0,
        percentage: 5,
        timestamp: Date.now(),
        lectureTitle: lec.title,
        subjectName: foundSubject,
        batchName: foundBatch,
        batchId: lec.batchId,
        subjectId: lec.subjectId,
      });
    } catch {
      addToast({ type: 'error', message: 'Failed to load lecture' });
      navigate('/dashboard');
    } finally {
      setPageLoading(false);
    }
  }, [batches, navigate, addToast, setPlaylist, setCurrentLecture]);

  useEffect(() => {
    if (lectureId && batches.length > 0) {
      loadLecture(lectureId);
    }
  }, [lectureId, batches, loadLecture]);

  const handleServerChange = (server: VideoServer) => {
    setCurrentServerState(server);
    if (lectureId) {
      setSelectedServer(lectureId, server.id);
    }
    addToast({ type: 'info', message: `Switched to ${server.name}` });
  };

  const handleLectureSelect = (lec: Lecture) => {
    navigate(`/watch/${lec.id}`, { replace: true });
  };

  const goNext = () => {
    const next = getNextLecture();
    if (next) {
      navigate(`/watch/${next.id}`, { replace: true });
      addToast({ type: 'info', message: `Playing: ${next.title}` });
    }
  };

  const goPrev = () => {
    const prev = getPrevLecture();
    if (prev) {
      navigate(`/watch/${prev.id}`, { replace: true });
      addToast({ type: 'info', message: `Playing: ${prev.title}` });
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-surface-400 text-sm animate-pulse">Loading lecture...</p>
        </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-surface-500">Lecture not found</p>
      </div>
    );
  }

  const nextLecture = getNextLecture();
  const prevLecture = getPrevLecture();

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Video Player */}
        <div className="p-3 md:p-4 lg:p-6">
          <VideoPlayer
            server={currentServer}
          />
        </div>

        {/* Controls & Info */}
        <div className="px-3 md:px-4 lg:px-6 pb-6 space-y-4">
          {/* Navigation Controls */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg bg-surface-800/50 text-surface-400 hover:text-white hover:bg-surface-800/80 transition-all"
                title="Back to dashboard"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goPrev}
                disabled={!prevLecture}
                className="px-3 py-2 rounded-lg bg-surface-800/50 text-surface-400 hover:text-white hover:bg-surface-800/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm"
                title={prevLecture ? `Previous: ${prevLecture.title}` : 'No previous lecture'}
              >
                <SkipBack className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={goNext}
                disabled={!nextLecture}
                className="px-3 py-2 rounded-lg bg-surface-800/50 text-surface-400 hover:text-white hover:bg-surface-800/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm"
                title={nextLecture ? `Next: ${nextLecture.title}` : 'No next lecture'}
              >
                <span className="hidden sm:inline">Next</span>
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Auto Next Toggle */}
              <button
                onClick={toggleAutoNext}
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm transition-all ${
                  autoNext
                    ? 'bg-primary-500/15 text-primary-300 border border-primary-500/20'
                    : 'bg-surface-800/50 text-surface-400 border border-surface-700/30'
                }`}
                title="Auto-play next lecture"
              >
                {autoNext ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                <span className="hidden sm:inline">Auto Next</span>
              </button>

              {/* Playlist Toggle */}
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="px-3 py-2 rounded-lg bg-surface-800/50 text-surface-400 hover:text-white hover:bg-surface-800/80 transition-all flex items-center gap-1.5 text-sm lg:hidden"
              >
                <ListVideo className="w-4 h-4" />
                <span className="hidden sm:inline">Playlist</span>
              </button>
            </div>
          </div>

          {/* Lecture Title */}
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-white">{lecture.title}</h1>
            <p className="text-sm text-surface-400 mt-1">
              {batchName} → {subjectName}
              {lecture.duration && <span className="ml-2 text-surface-600">• {lecture.duration}</span>}
            </p>
            {lecture.description && (
              <p className="text-sm text-surface-500 mt-3 leading-relaxed">{lecture.description}</p>
            )}
          </div>

          {/* Server Selector */}
          <ServerSelector
            servers={lecture.servers}
            currentServer={currentServer}
            onSelect={handleServerChange}
          />
        </div>
      </div>

      {/* Playlist Panel - Desktop always visible, mobile toggleable */}
      <div className="hidden lg:block">
        <PlaylistPanel
          lectures={playlistLectures}
          currentLectureId={lecture.id}
          onSelect={handleLectureSelect}
          isOpen={true}
          onClose={() => {}}
          subjectName={subjectName}
        />
      </div>
      <PlaylistPanel
        lectures={playlistLectures}
        currentLectureId={lecture.id}
        onSelect={handleLectureSelect}
        isOpen={showPlaylist}
        onClose={() => setShowPlaylist(false)}
        subjectName={subjectName}
      />
    </div>
  );
}
