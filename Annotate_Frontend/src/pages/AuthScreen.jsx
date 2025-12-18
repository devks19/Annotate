import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Sparkles, Users } from 'lucide-react';
import { api } from '../services/api';
import useAuth from '../hooks/useAuth';

export default function AuthScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'VIEWER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = isLogin
        ? await api.auth.login(formData.email, formData.password)
        : await api.auth.register(formData);

      login(response);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-60">
        <div className="absolute -top-40 -left-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-60px] h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl grid md:grid-cols-[1.15fr,1fr] gap-8 items-center z-10">
        {/* Left side: Brand / Story */}
        <div className="hidden md:flex flex-col gap-6 rounded-3xl border border-slate-800/70 bg-slate-900/80 backdrop-blur-2xl p-8 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-slate-800 flex items-center justify-center">
              <Camera className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-50 tracking-tight">
                Annotate
              </h1>
              <p className="text-xs text-slate-400">
                Review videos together. Clearly. Quickly.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-50 mb-2">
              Feedback that actually helps.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Annotate lets creators and teams drop precise, time-stamped notes
              on videos — so feedback stops living in random chats and screenshots.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 mt-0.5 text-indigo-300" />
              <div>
                <p className="font-medium text-slate-100">Creators</p>
                <p className="text-xs text-slate-400">
                  Share links, control access, and keep every comment mapped to the
                  exact second it matters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 mt-0.5 text-sky-300" />
              <div>
                <p className="font-medium text-slate-100">Viewers</p>
                <p className="text-xs text-slate-400">
                  Request access with one click, leave focused feedback, and revisit
                  approved videos anytime.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <div className="h-1 w-6 rounded-full bg-indigo-400/70" />
            <span>Built for honest, friction-free collaboration.</span>
          </div>
        </div>

        {/* Right side: Auth card */}
        <div className="app-card p-6 md:p-8 animate-[fade-in-up_0.35s_ease-out]">
          {/* Mobile brand header */}
          <div className="flex items-center justify-center gap-2 mb-6 md:hidden">
            <div className="h-9 w-9 rounded-2xl bg-slate-800 flex items-center justify-center">
              <Camera className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-50">Annotate</h1>
              <p className="text-[11px] text-slate-400">
                Sign in to keep your feedback in sync.
              </p>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center bg-slate-900/80 rounded-xl p-1 mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-slate-100 text-slate-900 shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-slate-100 text-slate-900 shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              Register
            </button>
          </div>

          {/* Title & helper text */}
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-50">
              {isLogin ? 'Welcome back' : 'Create your Annotate account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isLogin
                ? 'Enter your email and password to access your workspace.'
                : ''}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required={!isLogin}
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />

            {!isLogin && (
              <div className="space-y-1">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field bg-slate-900/90"
                >
                  <option value="VIEWER" style={{ color: 'black' }}>
                    Viewer
                  </option>
                  <option value="CREATOR" style={{ color: 'black' }}>
                    Creator
                  </option>
                  {/* <option value="TEAM" style={{ color: 'black' }}>Team member</option> */}
                  {/* <option value="ADMIN" style={{ color: 'black' }}>Admin</option> */}
                </select>
                <p className="text-[11px] text-slate-500">
                  Viewers can watch & comment on shared videos. Creators can upload
                  videos and control access.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading
                ? 'Please wait...'
                : isLogin
                ? 'Continue to dashboard'
                : 'Create account'}
            </button>
          </form>

          {/* {isLogin && (
            <p className="mt-4 text-[11px] text-slate-500 text-center">
              New here?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-indigo-300 hover:text-indigo-200 underline-offset-2 hover:underline"
              >
                Create an account
              </button>
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
}
