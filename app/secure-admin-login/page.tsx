'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SecureAdminLoginPage() {
  const router = useRouter();
  const { login, currentUser } = useApp();

  const [email, setEmail] = useState('derindenny65@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (currentUser?.role === 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 glass-panel p-8 rounded-3xl border border-emerald-500/40 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
        <h2 className="text-xl font-extrabold text-white">Chief Admin Authorized</h2>
        <p className="text-xs text-slate-300">You hold active executive administrative clearance.</p>
        <button
          onClick={() => router.push('/secure-admin-dashboard')}
          className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all"
        >
          Proceed to Secure Executive Dashboard →
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const res = login(email, password);
    if (res.success) {
      setSuccess('Executive Clearance Authorized');
      setTimeout(() => router.push('/secure-admin-dashboard'), 600);
    } else {
      setError(res.message || 'Invalid administrative credentials.');
    }
  };

  const handleQuickFill = () => {
    setEmail('derindenny65@gmail.com');
    setPassword('AdminApex2026!');
  };

  return (
    <div className="max-w-md mx-auto my-12 glass-panel rounded-3xl border border-slate-700/80 p-8 space-y-6 shadow-2xl">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Protected Admin Gate</h1>
        <p className="text-xs text-slate-400">
          Restricted Portal. Authorized Chief Administrators Only.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-3 text-xs rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Admin Security Identification</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl glass-input focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Security Passphrase</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl glass-input focus:outline-none font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-extrabold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
        >
          <span>Authenticate Clearance</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleQuickFill}
          className="w-full py-2 rounded-xl text-xs text-emerald-400 hover:text-emerald-300 bg-slate-900 border border-emerald-500/20 font-mono"
        >
          Auto-Fill Master Admin Credentials
        </button>
      </form>
    </div>
  );
}
