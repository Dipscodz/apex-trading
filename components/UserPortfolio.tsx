'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  PieChart,
  History,
  XCircle,
  PlusCircle,
  MinusCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export const UserPortfolio: React.FC = () => {
  const {
    currentUser,
    positions,
    closePosition,
    requestDeposit,
    requestWithdrawal,
    transactions,
    simulationEvents,
    performanceDataPoints
  } = useApp();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!currentUser) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto my-12 border border-slate-800">
        <Wallet className="w-12 h-12 text-sky-400 mx-auto" />
        <h2 className="text-2xl font-extrabold text-white">Portfolio Access Restricted</h2>
        <p className="text-slate-400 text-xs">
          Please sign in to view your live asset holdings, active positions, and trade history.
        </p>
      </div>
    );
  }

  // Filter positions & transactions for this user
  const userPositions = positions.filter((p) => p.userId === currentUser.id);
  const openPositions = userPositions.filter((p) => p.status === 'open');
  const userTxHistory = transactions.filter((t) => t.userId === currentUser.id);
  const userPerfPoints = performanceDataPoints.filter((p) => p.userId === currentUser.id);
  const userSimEvents = simulationEvents.filter((s) => s.userId === currentUser.id);

  const totalOpenValuation = openPositions.reduce((acc, p) => acc + p.currentValuation, 0);
  const totalOpenPnl = openPositions.reduce((acc, p) => acc + p.pnl, 0);
  const netEquity = currentUser.balance + totalOpenValuation;
  const isPnlPositive = totalOpenPnl >= 0;

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const num = parseFloat(depositAmount);
    if (!num || num <= 0) return;
    const res = requestDeposit(num);
    if (res.success) {
      setMsg({ type: 'success', text: res.message });
      setDepositAmount('');
      setTimeout(() => { setIsDepositOpen(false); setMsg(null); }, 1500);
    } else {
      setMsg({ type: 'error', text: res.message });
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const num = parseFloat(withdrawAmount);
    if (!num || num <= 0) return;
    const res = requestWithdrawal(num);
    if (res.success) {
      setMsg({ type: 'success', text: res.message });
      setWithdrawAmount('');
      setTimeout(() => { setIsWithdrawOpen(false); setMsg(null); }, 1500);
    } else {
      setMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Educational Paper Trading Disclaimer Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-200 text-xs">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 uppercase tracking-wide block">
            Educational Paper Trading Platform Disclaimer
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Notice: All portfolio balances, profits, losses, market prices, asset holdings, and transactions displayed on this platform are simulated for paper trading and educational learning purposes only. They hold no real monetary value, financial claim, or legal entitlement.
          </p>
        </div>
      </div>
      
      {/* Portfolio Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Net Equity */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Net Portfolio Valuation</span>
            <Wallet className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-2">
            <span>₹{netEquity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            {currentUser.email === 'sreeragmsm@gmail.com' && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                ₹10,00,000 (1 Lakh INR Capital)
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Cash Balance: <span className="text-slate-200 font-bold font-mono">₹{currentUser.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Unrealized PnL */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Unrealized Positions P&L</span>
            {isPnlPositive ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
          </div>
          <div className={`text-3xl font-extrabold font-mono ${isPnlPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPnlPositive ? '+' : ''}₹{totalOpenPnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Active Open Trades: <span className="text-slate-200 font-bold">{openPositions.length}</span>
          </div>
        </div>

        {/* Action Buttons: Deposit & Withdraw */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="text-xs text-slate-400 font-semibold">Account Capital Operations</div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setIsDepositOpen(true); setMsg(null); }}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Deposit Capital</span>
            </button>
            <button
              onClick={() => { setIsWithdrawOpen(true); setMsg(null); }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
            >
              <MinusCircle className="w-4 h-4 text-sky-400" />
              <span>Withdrawal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Performance Trajectory Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-white text-base">Simulated Performance Trajectory</h3>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Historical valuation trajectory based on admin portfolio simulation events & trades
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto">
            Live Equity: ₹{netEquity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {userPerfPoints.length > 0 ? (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userPerfPoints} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="userValGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Valuation']}
                />
                <Area
                  type="monotone"
                  dataKey="portfolioValue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#userValGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs">
            No historical performance points recorded yet.
          </div>
        )}
      </div>

      {/* Admin Simulation Event History Table (If any exist for user) */}
      {userSimEvents.length > 0 && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-white text-sm">Simulated Portfolio P&L Allocation History</h3>
            </div>
            <span className="text-[11px] text-amber-400 font-mono font-semibold">
              {userSimEvents.length} Simulation Events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Execution Mode</th>
                  <th className="py-3 px-4">Target Amount</th>
                  <th className="py-3 px-4">Simulated Result</th>
                  <th className="py-3 px-4 text-right">Resulting Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {userSimEvents.map((sim) => {
                  const isGain = sim.generatedAmount >= 0;
                  return (
                    <tr key={sim.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-sans text-[11px]">
                        {new Date(sim.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            isGain ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {sim.simulationType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-sans capitalize">
                        {sim.executionMode === 'exact' ? 'Exact Allocation' : `Randomized (±${sim.simulationMargin}%)`}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        ₹{sim.targetAmount.toLocaleString('en-IN')}
                      </td>
                      <td className={`py-3 px-4 font-bold ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isGain ? '+' : ''}₹{sim.generatedAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-white">
                        ₹{sim.newPortfolioValuation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Positions Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-sky-400" />
            <h3 className="font-extrabold text-white text-sm">Active Trading Positions ({openPositions.length})</h3>
          </div>
        </div>

        {openPositions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="text-sm font-medium">No open positions currently active.</p>
            <Link
              href="/"
              className="inline-block text-xs text-sky-400 font-bold hover:underline"
            >
              Explore Live Markets to Execute Trades →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">Side / Leverage</th>
                  <th className="py-3 px-4">Entry Price</th>
                  <th className="py-3 px-4">Effective Price</th>
                  <th className="py-3 px-4">Invested Value</th>
                  <th className="py-3 px-4">Unrealized P&L</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {openPositions.map((pos) => {
                  const isPosPnlGood = pos.pnl >= 0;
                  return (
                    <tr key={pos.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-sky-400 font-extrabold">{pos.symbol}</span>
                          <span className="text-[11px] text-slate-400 font-normal">({pos.amount} units)</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            pos.type === 'buy'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {pos.type} {pos.leverage}x
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        ₹{pos.entryPrice.toLocaleString('en-IN', { minimumFractionDigits: pos.entryPrice < 1 ? 4 : 2 })}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-white">
                        ₹{pos.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: pos.currentPrice < 1 ? 4 : 2 })}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        ₹{pos.totalInvested.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 font-bold">
                        <div className={`flex items-center gap-1 ${isPosPnlGood ? 'text-emerald-400' : 'text-rose-400'}`}>
                          <span>{isPosPnlGood ? '+' : ''}₹{pos.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="text-[10px] font-sans">({isPosPnlGood ? '+' : ''}{pos.pnlPercentage}%)</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-sans">
                        <button
                          onClick={() => closePosition(pos.id)}
                          className="px-3 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white text-[11px] font-bold transition-all shadow-md"
                        >
                          Close Position
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction History Log */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-sky-400" />
            <h3 className="font-extrabold text-white text-sm">Account Transaction History</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {userTxHistory.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-4 text-slate-400 font-sans text-[11px]">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-sans capitalize font-semibold text-slate-300">
                    {tx.type.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{tx.details}</td>
                  <td className="py-3 px-4 font-bold text-white">
                    ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        tx.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : tx.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" /> Deposit Wire Capital
              </h3>
              <button onClick={() => setIsDepositOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {msg && (
              <div className={`p-3 text-xs rounded-xl border ${
                msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Deposit Amount (INR)</label>
                <input
                  type="number"
                  required
                  min="100"
                  placeholder="5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl glass-input font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1000, 5000, 25000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDepositAmount(val.toString())}
                    className="py-1 rounded-lg bg-slate-800 text-xs font-semibold text-sky-300 hover:bg-slate-700"
                  >
                    +₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                Confirm Instant Credit Deposit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <MinusCircle className="w-5 h-5 text-sky-400" /> Capital Withdrawal Request
              </h3>
              <button onClick={() => setIsWithdrawOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {msg && (
              <div className={`p-3 text-xs rounded-xl border ${
                msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Withdrawal Amount (INR)</label>
                <input
                  type="number"
                  required
                  min="10"
                  max={currentUser.balance}
                  placeholder="1000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl glass-input font-mono font-bold focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  Max Available: ₹{currentUser.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                Submit Withdrawal Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
