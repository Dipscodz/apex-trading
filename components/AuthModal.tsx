'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  User,
  Lock,
  Mail,
  ArrowRight,
  X,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { login, signup, verifyCredentials } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'admin'>(defaultTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // OTP states
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setOtpError('');

    if (activeTab === 'login') {
      const res = verifyCredentials(email, password);

      if (!res.success) {
        setError(res.message);
        return;
      }

      try {
        setOtpLoading(true);

        const response = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          // If mail service is not configured or in dev mode, fallback to direct login
          const directLogin = login(email, password);
          if (directLogin.success) {
            setSuccess(directLogin.message);
            setTimeout(onClose, 800);
            return;
          }
          setError(data.message || 'Failed to send OTP.');
          return;
        }

        setOtpStep(true);
        setSuccess('OTP sent to your email.');
      } catch {
        // Fallback to direct login in offline / demo environment
        const directLogin = login(email, password);
        if (directLogin.success) {
          setSuccess(directLogin.message);
          setTimeout(onClose, 800);
          return;
        }
        setError('Unable to send OTP. Please try again.');
      } finally {
        setOtpLoading(false);
      }

      return;
    }

    if (activeTab === 'admin') {
      const res = login(
        email || 'admin@apexquantum.io',
        password || 'AdminApex2026!'
      );

      if (res.success) {
        setSuccess('Admin Authentication Authorized');
        setTimeout(onClose, 800);
      } else {
        setError(res.message);
      }

      return;
    }

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
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter the 6-digit OTP.');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setOtpError(data.message || 'Invalid OTP.');
        return;
      }

      const res = login(email, password);

      if (!res.success) {
        setOtpError(res.message);
        return;
      }

      setSuccess('Email verified. Login successful!');
      setTimeout(onClose, 800);
    } catch {
      setOtpError('Unable to verify OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const fillDemoUser = () => {
    setEmail('trader@apexquantum.io');
    setPassword('trader123');
    setActiveTab('login');
    setOtpStep(false);
    setOtp('');
    setOtpError('');
    setError('');
    setSuccess('');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@apexquantum.io');
    setPassword('AdminApex2026!');
    setActiveTab('admin');
    setOtpStep(false);
    setOtp('');
    setOtpError('');
    setError('');
    setSuccess('');
  };

  const resetOTP = () => {
    setOtpStep(false);
    setOtp('');
    setOtpError('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-sky-400" />
            <span className="font-bold tracking-tight text-white text-lg">Apex Access Portal</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 bg-slate-950/60 p-1.5 border-b border-slate-800 text-xs font-semibold text-slate-400">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              resetOTP();
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'login' ? 'bg-sky-600 text-white shadow-md' : 'hover:text-slate-200'
            }`}
          >
            Client Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              resetOTP();
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'signup' ? 'bg-sky-600 text-white shadow-md' : 'hover:text-slate-200'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              resetOTP();
            }}
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
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {success}
            </div>
          )}

          {otpStep && activeTab === 'login' ? (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-semibold text-white">Verify Your Email</h2>
                <p className="text-sm text-slate-400">We&apos;ve sent a 6-digit verification code to</p>
                <p className="text-sm font-medium text-sky-400 break-all">{email}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Enter OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 text-center text-lg tracking-[0.5em] rounded-xl glass-input focus:outline-none"
                />
              </div>

              {otpError && (
                <div className="p-3 text-xs rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium">
                  {otpError}
                </div>
              )}

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={otpLoading || otp.length !== 6}
                className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {otpLoading ? 'Verifying...' : 'Verify OTP & Sign In'}
              </button>

              <button
                type="button"
                onClick={resetOTP}
                className="w-full py-2 text-sm text-slate-400 hover:text-white"
              >
                ← Back to Login
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </form>
      </div>
    </div>
  );
};
