// Toast container component
import { Toast } from '../../types';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'text-green-400 bg-green-500/10 border-green-500/20',
  error: 'text-red-400 bg-red-500/10 border-red-500/20',
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
};

interface Props {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: Props) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`toast-enter pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl ${colors[toast.type]}`}
          >
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/90 flex-1">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-white/40 hover:text-white/70 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
