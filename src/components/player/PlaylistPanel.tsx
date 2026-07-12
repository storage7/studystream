import { Lecture } from '../../types';
import { getPlaybackProgress } from '../../utils/storage';
import { PlayCircle, CheckCircle, X } from 'lucide-react';

interface Props {
  lectures: Lecture[];
  currentLectureId: string;
  onSelect: (lecture: Lecture) => void;
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
}

export default function PlaylistPanel({ lectures, currentLectureId, onSelect, isOpen, onClose, subjectName }: Props) {
  const progress = getPlaybackProgress();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-80 z-50 glass border-l border-surface-800/50 transform transition-transform duration-300 ease-out flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:relative lg:translate-x-0 lg:z-10 lg:w-80 lg:flex-shrink-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-surface-800/50">
          <div>
            <h3 className="font-semibold text-white text-sm">Playlist</h3>
            <p className="text-xs text-surface-500 mt-0.5">{subjectName} • {lectures.length} lectures</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-800/50 transition-colors lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {lectures.sort((a, b) => a.order - b.order).map((lecture, idx) => {
            const isActive = lecture.id === currentLectureId;
            const prog = progress[lecture.id];
            const completed = prog && prog.percentage >= 95;

            return (
              <button
                key={lecture.id}
                onClick={() => onSelect(lecture)}
                className={`w-full flex items-start gap-3 p-3.5 text-left transition-all duration-200 border-b border-surface-800/30
                  ${isActive
                    ? 'bg-primary-500/10 border-l-2 border-l-primary-500'
                    : 'hover:bg-surface-800/30 border-l-2 border-l-transparent'
                  }`}
              >
                <div className="flex-shrink-0 w-7 text-center">
                  {completed ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                  ) : isActive ? (
                    <div className="w-5 h-5 mx-auto rounded-full bg-primary-500 flex items-center justify-center">
                      <PlayCircle className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <span className="text-xs text-surface-600">{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${isActive ? 'text-primary-300 font-medium' : 'text-surface-300'}`}>
                    {lecture.title}
                  </p>
                  {lecture.duration && (
                    <p className="text-xs text-surface-600 mt-0.5">{lecture.duration}</p>
                  )}
                  {prog && !completed && prog.percentage > 0 && (
                    <div className="mt-1.5 h-0.5 bg-surface-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${prog.percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
