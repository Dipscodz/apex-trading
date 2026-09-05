'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { User } from '@/types';
import {
  Shield,
  ShieldCheck,
  Users,
  DollarSign,
  Edit3,
  Sliders,
  PlusCircle,
  MinusCircle,
  TrendingUp,
  AlertTriangle,
  Lock,
  Unlock,
  Check,
  X,
  Search,
  Activity,
  Award
} from 'lucide-react';
import { AuthModal } from './AuthModal';

export const AdminConsole: React.FC = () => {
  const {
    currentUser,
    users,
    markets,
    adminOverrides,
    updateUserBalance,
    setUserPriceOverride,
    removeUserPriceOverride,
    allocateProfitLoss,
    setUserProfitMultiplier,
    toggleUserStatus,
    transactions,
    approveTransaction,
    rejectTransaction,
    auditLogs
  } = useApp();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modal states for Admin actions
  const [editBalanceModal, setEditBalanceModal] = useState(false);
  const [newBalanceInput, setNewBalanceInput] = useState('');

  const [overrideModal, setOverrideModal] = useState(false);
  const [overrideSymbol, setOverrideSymbol] = useState('BTC');
  const [overridePriceInput, setOverridePriceInput] = useState('');

  const [profitModal, setProfitModal] = useState(false);
  const [profitAmountInput, setProfitAmountInput] = useState('');
  const [profitDetailsInput, setProfitDetailsInput] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-5 max-w-md mx-auto my-12 border border-slate-800 shadow-2xl">
        <Shield className="w-14 h-14 text-rose-500 mx-auto animate-pulse" />
        <h2 className="text-2xl font-extrabold text-white">Administrative Access Required</h2>
        <p className="text-slate-400 text-xs">
          You must be authenticated with Chief Administrator credentials to access user share prices and profit management.
        </p>
        <a
          href="/admin/login"
          className="inline-block px-6 py-3 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 transition-all"
        >
          Go to Executive Admin Gate →
        </a>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTransactions = transactions.filter((t) => t.status === 'pending');

  const openBalanceEdit = (user: User) => {
    setSelectedUser(user);
    setNewBalanceInput(user.balance.toString());
    setEditBalanceModal(true);
  };

  const handleSaveBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const val = parseFloat(newBalanceInput);
    if (!isNaN(val)) {
      updateUserBalance(selectedUser.id, val, 'Manual Admin Edit');
      setEditBalanceModal(false);
    }
  };

  const openPriceOverride = (user: User) => {
    setSelectedUser(user);
    setOverrideSymbol('BTC');
    setOverridePriceInput('');
    setOverrideModal(true);
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const val = parseFloat(overridePriceInput);
    if (!isNaN(val) && val > 0) {
      setUserPriceOverride(selectedUser.id, overrideSymbol, val);
      setOverrideModal(false);
    }
  };

  const openProfitAllocation = (user: User) => {
    setSelectedUser(user);
    setProfitAmountInput('');
    setProfitDetailsInput('Quarterly Share Profit Bonus');
    setProfitModal(true);
  };

  const handleSaveProfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const val = parseFloat(profitAmountInput);
    if (!isNaN(val)) {
      allocateProfitLoss(selectedUser.id, val, profitDetailsInput || 'Administrative Profit Distribution');
      setProfitModal(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Admin Title Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Executive Command Center</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE SESSION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage client accounts, set custom asset share prices, allocate profits/losses, and review order flow.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-slate-400 block font-medium">Logged in as</span>
            <span className="font-bold text-emerald-400">{currentUser.name} ({currentUser.email})</span>
          </div>
        </div>
      </div>

      {/* Users Management Grid */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" /> Client Accounts Directory ({users.length})
            </h2>
            <p className="text-xs text-slate-400">
              Click on controls to adjust wallet balances, custom share prices, or profit distribution.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Client Name</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Cash Balance</th>
                <th className="py-3.5 px-4">Profit Multiplier</th>
                <th className="py-3.5 px-4">Active Custom Price Overrides</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredUsers.map((u) => {
                const userOverrides = adminOverrides.filter((o) => o.userId === u.id);
                return (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    
                    {/* User Details */}
                    <td className="py-4 px-4 font-sans">
                      <div>
                        <span className="font-bold text-white block text-sm">{u.name}</span>
                        <span className="text-[11px] text-slate-400 block">{u.email}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4 font-sans">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded ${
                          u.role === 'admin'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Balance */}
                    <td className="py-4 px-4 font-bold text-white text-sm">
                      ₹{u.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Multiplier */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className="font-bold text-amber-400">{u.profitMultiplier}x</span>
                        <select
                          value={u.profitMultiplier}
                          onChange={(e) => setUserProfitMultiplier(u.id, parseFloat(e.target.value))}
                          className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded px-1 py-0.5"
                        >
                          <option value="1.0">1.0x (Standard)</option>
                          <option value="1.25">1.25x (+25% Profit)</option>
                          <option value="1.5">1.5x (+50% Profit)</option>
                          <option value="2.0">2.0x (Double Return)</option>
                        </select>
                      </div>
                    </td>

                    {/* Overrides */}
                    <td className="py-4 px-4 font-sans">
                      {userOverrides.length > 0 ? (
                        <div className="space-y-1">
                          {userOverrides.map((ov) => (
                            <div key={ov.symbol} className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-bold text-sky-400">{ov.symbol}:</span>
                              <span className="font-mono text-emerald-300">₹{ov.overridePrice.toLocaleString('en-IN')}</span>
                              <button
                                onClick={() => removeUserPriceOverride(u.id, ov.symbol)}
                                className="text-rose-400 hover:text-rose-300 text-[10px] font-bold"
                              >
                                [Remove]
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Standard Market Rates</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 font-sans">
                      <button
                        onClick={() => toggleUserStatus(u.id, u.status === 'active' ? 'frozen' : 'active')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-colors flex items-center gap-1 ${
                          u.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {u.status === 'active' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        <span>{u.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openBalanceEdit(u)}
                          title="Edit Cash Balance"
                          className="px-2.5 py-1 rounded-lg bg-sky-600/80 hover:bg-sky-500 text-white font-bold text-[11px] transition-all flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Balance
                        </button>
                        <button
                          onClick={() => openPriceOverride(u)}
                          title="Override Crypto Asset Price for User"
                          className="px-2.5 py-1 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-white font-bold text-[11px] transition-all flex items-center gap-1"
                        >
                          <Sliders className="w-3 h-3" /> Custom Price
                        </button>
                        <button
                          onClick={() => openProfitAllocation(u)}
                          title="Inject Profit / Loss Adjustment"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all flex items-center gap-1"
                        >
                          <Award className="w-3 h-3" /> Add Profit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Transactions Approvals Queue */}
      {pendingTransactions.length > 0 && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Pending Compliance Review Queue ({pendingTransactions.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Requested Amount</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4 text-right">Approve / Reject</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pendingTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-sans font-bold text-white">{tx.userName}</td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-amber-300">{tx.type}</td>
                    <td className="py-3.5 px-4 font-bold text-white">${tx.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-sans text-slate-400">{tx.details}</td>
                    <td className="py-3.5 px-4 text-right font-sans space-x-2">
                      <button
                        onClick={() => approveTransaction(tx.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectTransaction(tx.id)}
                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Audit Log Trail */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-400" /> Administrative Audit Log Trail
        </h2>
        {auditLogs.length === 0 ? (
          <p className="text-xs text-slate-400">No administrative changes recorded in this session yet.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-slate-300">
                <div>
                  <span className="text-emerald-400 font-bold font-sans mr-2">[{log.action}]</span>
                  <span>{log.details}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-sans">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Edit Wallet Balance */}
      {editBalanceModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-base">Adjust Cash Balance for {selectedUser.name}</h3>
            <form onSubmit={handleSaveBalance} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">New Balance (USD)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={newBalanceInput}
                  onChange={(e) => setNewBalanceInput(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl glass-input font-mono font-bold focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditBalanceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
                >
                  Save Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Set Custom Share/Asset Price Override */}
      {overrideModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div>
              <h3 className="font-extrabold text-white text-base">Set Custom Share Price Override</h3>
              <p className="text-xs text-slate-400">
                Override the effective unit valuation of an asset specifically for {selectedUser.name}.
              </p>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Asset Symbol</label>
                <select
                  value={overrideSymbol}
                  onChange={(e) => setOverrideSymbol(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl glass-input font-mono font-bold focus:outline-none"
                >
                  {markets.map((m) => (
                    <option key={m.id} value={m.symbol}>
                      {m.symbol} ({m.name}) - Live Market Price: ${m.current_price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Custom Target Price for {selectedUser.name} ($)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 105000"
                  value={overridePriceInput}
                  onChange={(e) => setOverridePriceInput(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl glass-input font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOverrideModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                >
                  Apply Price Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Direct Profit / Loss Allocation */}
      {profitModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div>
              <h3 className="font-extrabold text-white text-base">Inject Profit / Loss Adjustment</h3>
              <p className="text-xs text-slate-400">
                Directly add profit (positive) or deduct loss (negative) for {selectedUser.name}.
              </p>
            </div>

            <form onSubmit={handleSaveProfit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 2500 for profit, -500 for loss"
                  value={profitAmountInput}
                  onChange={(e) => setProfitAmountInput(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl glass-input font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reason / Description</label>
                <input
                  type="text"
                  required
                  placeholder="Quarterly Performance Profit Share"
                  value={profitDetailsInput}
                  onChange={(e) => setProfitDetailsInput(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl glass-input font-sans focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProfitModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Allocate Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
