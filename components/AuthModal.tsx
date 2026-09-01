'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Shield, User, Lock, Mail, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, signup } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'admin'>(defaultTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (activeTab === 'login') {
      const res = login(email, password);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(onClose, 800);
      } else {
        setError(res.message);
      }
    } else if (activeTab === 'admin') {
      const res = login(email || 'admin@apexquantum.io', password || 'AdminApex2026!');
      if (res.success) {
        setSuccess('Admin Authentication Authorized');
        setTimeout(onClose, 800);
      } else {
        setError(res.message);
      }
    } else {
      if (!name || !email || !password) {
        setError('Please complete all required fields.');
        return;
      }
      const res = signup(name, email, password);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(onClose, 800);
      } else {
        setError(res.message);
      }
    }
  };

  const fillDemoUser = () => {
    setEmail('trader@apexquantum.io');
    setPassword('trader123');
    setActiveTab('login');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@apexquantum.io');
    setPassword('AdminApex2026!');
    setActiveTab('admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-sky-400" />
            <span className="font-bold tracking-tight text-white text-lg">Apex Access Portal</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 bg-slate-950/60 p-1.5 border-b border-slate-800 text-xs font-semibold text-slate-400">
          <button
            onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'login' ? 'bg-sky-600 text-white shadow-md' : 'hover:text-slate-200'
            }`}
          >
            Client Login
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'signup' ? 'bg-sky-600 text-white shadow-md' : 'hover:text-slate-200'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setError(''); setSuccess(''); }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'admin' ? 'bg-emerald-600 text-white shadow-md' : 'hover:text-slate-200'
            }`}
          >
            Admin Terminal
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {success}
            </div>
          )}

          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl glass-input focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {activeTab === 'admin' ? 'Admin Security Identification' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder={activeTab === 'admin' ? 'admin@apexquantum.io' : 'client@domain.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl glass-input focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Passphrase</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl glass-input focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
              activeTab === 'admin'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
                : 'bg-sky-600 hover:bg-sky-500 shadow-sky-900/30'
            }`}
          >
            <span>
              {activeTab === 'login'
                ? 'Sign In to Terminal'
                : activeTab === 'admin'
                ? 'Authenticate Admin'
                : 'Create Client Account'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Autofill Helpers */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <span className="text-[11px] text-slate-400 font-medium block">Instant Credentials Quick-Fill:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fillDemoUser}
                className="flex-1 py-1.5 px-3 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-sky-300 border border-sky-500/20 text-center transition-colors"
              >
                Fill User Credentials
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="flex-1 py-1.5 px-3 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-emerald-500/20 text-center transition-colors"
              >
                Fill Admin Credentials
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
