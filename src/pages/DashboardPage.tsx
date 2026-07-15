import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Batch, PlaybackProgress, WatchHistory } from '../types';
import { getContinueWatching, getWatchHistory, getPlaybackProgress } from '../utils/storage';
import { CardSkeleton } from '../components/ui/Skeleton';
import {
  PlayCircle,
  Clock,
  TrendingUp,
  Layers,
  BookOpen,
  ChevronRight,
  BarChart3,
} from 'lucide-react';

interface OutletCtx {
  batches: Batch[];
  loading: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { batches, loading } = useOutletContext<OutletCtx>();
  const navigate = useNavigate();

  const continueWatching: PlaybackProgress[] = getContinueWatching();
  const recentHistory: WatchHistory[] = getWatchHistory();
  const allProgress = getPlaybackProgress();

  const totalLectures = batches.reduce(
    (sum, b) => sum + b.subjects.reduce((s, sub) => s + sub.lectures.length, 0),
    0
  );
  const completedLectures = Object.values(allProgress).filter(p => p.percentage >= 95).length;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-primary-600/20 via-surface-900/50 to-accent-600/10 border border-primary-500/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-surface-400 text-sm mb-1">{greeting()} 👋</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>
          </h1>
          <p className="text-surface-400 text-sm md:text-base">
            Continue your learning journey. You have {totalLectures} lectures across {batches.length} batches.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="glass-light rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-500/15 flex items-center justify-center">
                <Layers className="w-4 h-4 text-primary-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{batches.length}</p>
                <p className="text-xs text-surface-500">Batches</p>
              </div>
            </div>
            <div className="glass-light rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-500/15 flex items-center justify-center">
                <PlayCircle className="w-4 h-4 text-accent-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{totalLectures}</p>
                <p className="text-xs text-surface-500">Lectures</p>
              </div>
            </div>
            <div className="glass-light rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{completedLectures}</p>
                <p className="text-xs text-surface-500">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">Continue Watching</h2>
          </div>
          {/* Changed grid to lg:grid-cols-4 for exactly 4 columns on PC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {continueWatching
              .slice(0, 4) // Limit to maximum 4 items
              .map((item, idx) => (
                <button
                  key={item.lectureId}
                  onClick={() => navigate(`/watch/${item.lectureId}`)}
                  // Added conditional: hide index 2 & 3 on mobile (<lg), show on PC
                  className={`glass rounded-2xl overflow-hidden text-left hover:border-primary-500/30 transition-all duration-300 group hover:scale-[1.02] transform ${
                    idx >= 2 ? 'hidden lg:block' : 'block'
                  }`}
                >
                  <div className="relative h-32 bg-gradient-to-br from-primary-600/20 to-accent-600/10 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white/40 group-hover:text-white/70 transition-all duration-300 group-hover:scale-110" />
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-800">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">
                      {item.lectureTitle}
                    </h3>
                    <p className="text-xs text-surface-500 mt-1 truncate">
                      {item.subjectName} • {item.batchName}
                    </p>
                    <p className="text-xs text-primary-400 mt-2">
                      {Math.round(item.percentage)}% completed
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </section>
      )}

      {/* Recently Watched */}
      {recentHistory.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-accent-400" />
            <h2 className="text-lg font-semibold text-white">Recently Watched</h2>
          </div>
          {/* Changed grid to lg:grid-cols-4 for exactly 4 columns on PC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentHistory
              .slice(0, 4) // Limit to maximum 4 items
              .map((item, idx) => (
                <button
                  key={item.lectureId}
                  onClick={() => navigate(`/watch/${item.lectureId}`)}
                  // Added conditional: hide index 2 & 3 on mobile (<lg), show on PC
                  className={`glass rounded-2xl overflow-hidden text-left hover:border-primary-500/30 transition-all duration-300 group hover:scale-[1.02] transform ${
                    idx >= 2 ? 'hidden lg:block' : 'block'
                  }`}
                >
                  <div className="relative h-28 bg-gradient-to-br from-surface-800/50 to-surface-900/50 flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-white/30 group-hover:text-white/60 transition-all" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">
                      {item.lectureTitle}
                    </h3>
                    <p className="text-xs text-surface-500 mt-1 truncate">
                      {item.subjectName} • {item.batchName}
                    </p>
                    <p className="text-xs text-surface-600 mt-2">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </section>
      )}

      {/* All Batches */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-semibold text-white">All Batches</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map(batch => (
              <div
                key={batch.id}
                className="glass rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                      <Layers className="w-6 h-6 text-primary-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{batch.name}</h3>
                  {batch.description && (
                    <p className="text-sm text-surface-500 mb-4 line-clamp-2">{batch.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-surface-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {batch.subjects.length} subjects
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" />
                      {batch.subjects.reduce((s, sub) => s + sub.lectures.length, 0)} lectures
                    </span>
                  </div>

                  {/* Subjects */}
                  <div className="mt-4 space-y-2">
                    {batch.subjects.slice(0, 4).map(subject => (
                      <button
                        key={subject.id}
                        onClick={() => {
                          if (subject.lectures.length > 0) {
                            navigate(`/watch/${subject.lectures[0].id}`);
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-800/30 hover:bg-surface-800/60 transition-colors text-left group/item"
                      >
                        <BookOpen className="w-4 h-4 text-accent-400 flex-shrink-0" />
                        <span className="flex-1 text-sm text-surface-300 truncate group-hover/item:text-white transition-colors">
                          {subject.name}
                        </span>
                        <ChevronRight className="w-4 h-4 text-surface-600 group-hover/item:text-surface-400 transition-colors flex-shrink-0" />
                      </button>
                    ))}
                    {batch.subjects.length > 4 && (
                      <p className="text-xs text-surface-600 text-center pt-1">
                        +{batch.subjects.length - 4} more subjects
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
