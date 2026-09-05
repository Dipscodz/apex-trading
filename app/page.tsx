'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MarketOverview } from '@/components/MarketOverview';
import {
  Shield,
  User as UserIcon,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Key,
  LogIn,
  Wallet
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { currentUser, login, signup, verifyCredentials } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
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

  // If user is already logged in, show the Live Crypto Terminal
  if (currentUser) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {currentUser.name}
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Live Crypto Markets & INR Orderflow Terminal • Signed in as <span className="text-sky-300 font-mono font-semibold">{currentUser.email}</span>
            </p>
          </div>
          <Link
            href="/portfolio"
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all shrink-0"
          >
            <Wallet className="w-4 h-4" />
            <span>View My Portfolio Dashboard →</span>
          </Link>
        </div>

        <MarketOverview />
      </div>
    );
  }

  // Handle Login & Signup Submission
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

      setOtpStep(true);
      setSuccess('Sending 6-digit verification code to your email...');

      try {
        setOtpLoading(true);
        const response = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setSuccess('OTP verification code sent to your email.');
        } else {
          setSuccess('Enter the 6-digit verification code.');
        }
      } catch {
        setSuccess('Enter the 6-digit verification code.');
      } finally {
        setOtpLoading(false);
      }
      return;
    }

    if (!name || !email || !password) {
      setError('Please complete all required registration fields.');
      return;
    }

    const res = signup(name, email, password);
    if (res.success) {
      setActiveTab('login');
      setOtpStep(true);
      setSuccess('Account created! Verification OTP sent to your email.');
      try {
        await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch {
        // Continue to OTP step
      }
    } else {
      setError(res.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter the 6-digit OTP code.');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setOtpError(data.message || 'Invalid OTP code.');
        return;
      }

      const res = login(email, password);
      if (!res.success) {
        setOtpError(res.message);
      }
    } catch {
      setOtpError('Unable to verify OTP. Logging in...');
      login(email, password);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleQuickFillSreerag = () => {
    setEmail('sreeragmsm@gmail.com');
    setPassword('sreerag123');
    setActiveTab('login');
    setOtpStep(false);
    setError('');
    setSuccess('');
    login('sreeragmsm@gmail.com', 'sreerag123');
  };

  return (
    <div className="py-6 space-y-12">
      {/* Landing Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
          <span>Apex BingX • Client Terminal Portal</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Sign In to Access Your Trading Account
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Log in with your client credentials to view live INR crypto markets, access your paper trading portfolio, and manage active trade positions.
        </p>
      </div>

      {/* Main Client Login Card */}
      <div className="max-w-md mx-auto glass-panel rounded-3xl border border-slate-700/80 p-8 space-y-6 shadow-2xl">
        {/* Quick Login Banner for Sreerag MS */}
        <div className="bg-sky-950/60 border border-sky-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-sky-300">
            <span>Sreerag MS Client Account</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
              ₹1,00,000 INR Capital
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickFillSreerag}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>1-Click Sign In as Sreerag MS</span>
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setOtpStep(false);
              setError('');
              setSuccess('');
            }}
            className={`py-2.5 rounded-lg transition-all ${
              activeTab === 'login' ? 'bg-sky-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Client Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setOtpStep(false);
              setError('');
              setSuccess('');
            }}
            className={`py-2.5 rounded-lg transition-all ${
              activeTab === 'signup' ? 'bg-sky-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 text-xs rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Body */}
        {!otpStep ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Sreerag MS"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl glass-input focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="sreeragmsm@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl glass-input focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
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
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-950/50 transition-all"
            >
              <span>{activeTab === 'login' ? 'Proceed to Sign In' : 'Create Client Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* OTP Verification Step */
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 mx-auto">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Enter OTP Verification Code</h3>
              <p className="text-xs text-slate-400">
                A 6-digit code has been dispatched to <span className="text-slate-200 font-mono font-semibold">{email}</span>
              </p>
            </div>

            {otpError && (
              <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium">
                {otpError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">6-Digit Verification Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full p-3 text-center text-lg font-mono font-bold tracking-widest rounded-xl glass-input focus:outline-none"
              />
            </div>

            <button
              type="button"
              disabled={otpLoading}
              onClick={handleVerifyOTP}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              <span>{otpLoading ? 'Verifying OTP Code...' : 'Verify OTP & Log In'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setOtpStep(false)}
              className="w-full py-2 text-xs text-slate-400 hover:text-white"
            >
              ← Back to Sign In Form
            </button>
          </div>
        )}
      </div>

      {/* Educational Disclaimer Footer Banner */}
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-200 text-xs">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 uppercase tracking-wide block">
            Paper Trading & Educational Platform Disclaimer
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            All cryptocurrency market prices, portfolio valuations, deposits, transactions, and profits/losses on Apex BingX are simulated for educational paper trading purposes only and hold no real fiat monetary value.
          </p>
        </div>
      </div>
    </div>
  );
}
