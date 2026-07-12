import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Batch } from '../../types';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Layers,
  PlayCircle,
  GraduationCap,
  X,
} from 'lucide-react';
import { SidebarSkeleton } from '../ui/Skeleton';

interface Props {
  batches: Batch[];
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ batches, loading, isOpen, onClose }: Props) {
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  const toggleBatch = (id: string) => {
    setExpandedBatches(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSubject = (id: string) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const goToLecture = (lectureId: string) => {
    navigate(`/watch/${lectureId}`);
    onClose();
  };

  const isActive = (lectureId: string) => location.pathname === `/watch/${lectureId}`;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 z-50 glass border-r border-surface-800/50 transform transition-transform duration-300 ease-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:z-10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">StudyStream</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3">
          {loading ? (
            <SidebarSkeleton />
          ) : batches.length === 0 ? (
            <div className="p-6 text-center text-surface-500">
              <Layers className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No batches available</p>
            </div>
          ) : (
            <nav className="space-y-1 px-3">
              {batches.map(batch => (
                <div key={batch.id}>
                  {/* Batch */}
                  <button
                    onClick={() => toggleBatch(batch.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-surface-800/40 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors">
                      <Layers className="w-4 h-4 text-primary-400" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-surface-200 truncate">
                      {batch.name}
                    </span>
                    {expandedBatches.has(batch.id) ? (
                      <ChevronDown className="w-4 h-4 text-surface-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-surface-500 flex-shrink-0" />
                    )}
                  </button>

                  {/* Subjects */}
                  {expandedBatches.has(batch.id) && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-surface-800/50 pl-3">
                      {batch.subjects.map(subject => (
                        <div key={subject.id}>
                          <button
                            onClick={() => toggleSubject(subject.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-surface-800/30 transition-all duration-200 group"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" />
                            <span className="flex-1 text-sm text-surface-300 truncate">
                              {subject.name}
                            </span>
                            <span className="text-xs text-surface-600 flex-shrink-0">
                              {subject.lectures.length}
                            </span>
                            {expandedSubjects.has(subject.id) ? (
                              <ChevronDown className="w-3.5 h-3.5 text-surface-600 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-surface-600 flex-shrink-0" />
                            )}
                          </button>

                          {/* Lectures */}
                          {expandedSubjects.has(subject.id) && (
                            <div className="ml-3 mt-0.5 space-y-0.5 border-l border-surface-800/30 pl-3">
                              {subject.lectures
                                .sort((a, b) => a.order - b.order)
                                .map(lecture => (
                                  <button
                                    key={lecture.id}
                                    onClick={() => goToLecture(lecture.id)}
                                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-all duration-200 group text-sm
                                      ${isActive(lecture.id)
                                        ? 'bg-primary-500/15 text-primary-300'
                                        : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/20'
                                      }`}
                                  >
                                    <PlayCircle className={`w-3.5 h-3.5 flex-shrink-0 ${isActive(lecture.id) ? 'text-primary-400' : 'text-surface-600 group-hover:text-surface-400'}`} />
                                    <span className="truncate">{lecture.title}</span>
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-800/50">
          <p className="text-xs text-surface-600 text-center">
            © {new Date().getFullYear()} StudyStream
          </p>
        </div>
      </aside>
    </>
  );
}
