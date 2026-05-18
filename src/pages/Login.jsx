import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';

const roles = [
  { id: 'manager', label: 'Manager / Admin', color: 'indigo', desc: 'Full operational visibility' },
  { id: 'frontdesk', label: 'Front Desk', color: 'blue', desc: 'Reservations & guest ops' },
  { id: 'housekeeping', label: 'Housekeeping', color: 'amber', desc: 'Cleaning & room tasks' },
  { id: 'maintenance', label: 'Maintenance', color: 'red', desc: 'Repairs & equipment' },
];

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState('manager');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate('/'), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">HotelOps</h1>
          <p className="text-slate-400 text-sm">AI-Powered Operations Platform</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Sign in to continue</h2>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 block">Select Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    selectedRole === r.id
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                      : 'bg-white/3 border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-300'
                  }`}
                >
                  <p className="text-xs font-semibold">{r.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Email or Staff ID"
                defaultValue="admin@grandmeridian.com"
                className="inp pl-10"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                defaultValue="••••••••"
                className="inp pl-10 pr-10"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Demo notice */}
          <div className="mt-4 p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
            <p className="text-xs text-indigo-400 text-center">
              🚀 Demo mode — click Sign In to explore all features
            </p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2025 HotelOps Platform — Grand Meridian Hotels
        </p>
      </motion.div>
    </div>
  );
}
