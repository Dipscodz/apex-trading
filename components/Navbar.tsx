'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  Wallet,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  LogIn,
  Sliders,
  PieChart,
  Activity,
  DollarSign
} from 'lucide-react';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, logout, markets, positions } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup' | 'admin'>('login');

  // Calculate live portfolio total valuation for current user
  const userPositions = currentUser ? positions.filter((p) => p.userId === currentUser.id && p.status === 'open') : [];
  const openEquity = userPositions.reduce((acc, pos) => acc + pos.currentValuation, 0);
  const totalValuation = currentUser ? currentUser.balance + openEquity : 0;

  const openAuth = (tab: 'login' | 'signup' | 'admin' = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
        
        {/* Real-time Ticker Bar */}
        <div className="w-full bg-slate-950 px-4 py-1 border-b border-slate-800/50 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 text-xs whitespace-nowrap min-w-max">
            <div className="flex items-center gap-1.5 text-sky-400 font-bold tracking-wider text-[11px] uppercase">
              <Activity className="w-3.5 h-3.5 animate-pulse text-sky-400" />
              <span>Apex Live Stream:</span>
            </div>
            {markets.slice(0, 8).map((coin) => {
              const isPositive = coin.price_change_percentage_24h >= 0;
              return (
                <div key={coin.id} className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="font-semibold text-slate-300">{coin.symbol}</span>
                  <span className="text-white">₹{coin.current_price.toLocaleString('en-IN')}</span>
                  <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? '+' : ''}{coin.price_change_percentage_24h}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight block leading-tight">
                Apex<span className="text-sky-400 font-extrabold">BingX</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase block">
                INR Live Terminal
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            <Link
              href="/"
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                pathname === '/' ? 'bg-sky-600/90 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Markets</span>
            </Link>
            <Link
              href="/trade/BTC"
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                pathname.startsWith('/trade') ? 'bg-sky-600/90 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trade Terminal</span>
            </Link>
            <Link
              href="/portfolio"
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                pathname === '/portfolio' ? 'bg-sky-600/90 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </Link>

            {currentUser?.role === 'admin' && (
              <Link
                href="/secure-admin-dashboard"
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pathname === '/secure-admin-dashboard' || pathname === '/admin' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40' : 'text-emerald-400 hover:bg-emerald-950/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Executive Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Right Action / Auth Pill */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Balance Badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                  <Wallet className="w-4 h-4 text-sky-400" />
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-400 font-medium leading-none">Net Equity (INR)</span>
                    <span className="font-bold text-emerald-400 font-mono leading-tight">
                      ₹{totalValuation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Profile Pill */}
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-300 font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left text-xs">
                    <span className="font-semibold text-slate-200 block leading-tight">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{currentUser.role} Account</span>
                  </div>

                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-sky-400" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-950/40 transition-all flex items-center gap-1.5"
                >
                  <span>Register Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab={authTab}
      />
    </>
  );
};
