import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Phone, Lock, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function LoginPage() {
  const { login } = useAuth();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim() || !password.trim()) return;
    setLoading(true);
    await login(mobile.trim(), password);
    // If login fails, user is redirected to google.com
    // If succeeds, state updates and router redirects to dashboard
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-gray-950 to-surface-950" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-600/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[100px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass rounded-3xl p-8 md:p-10 glow-primary">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-4 shadow-lg shadow-primary-500/25">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">StudyStream</h1>
            <p className="text-surface-400 mt-2 text-sm">Sign in to access your lectures</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full px-4 py-3.5 rounded-xl bg-surface-800/50 border border-surface-700/50 text-white placeholder:text-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                required
                disabled={loading}
                autoComplete="tel"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 rounded-xl bg-surface-800/50 border border-surface-700/50 text-white placeholder:text-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-accent-500 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-500 shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-surface-600 text-xs mt-6">
          © {new Date().getFullYear()} StudyStream. All rights reserved.
        </p>
      </div>
    </div>
  );
}
