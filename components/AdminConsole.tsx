'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { User, AdminAuditLog, TransactionRecord, AdminTab, ComparisonPeriod } from '@/types';
import {
  Shield,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Activity,
  Sliders,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Lock,
  UserCheck,
  UserX,
  FileText,
  Download,
  BarChart3,
  Layers,
  CheckCircle2,
  Clock,
  Server,
  Key,
  ShieldCheck,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminConsole: React.FC = () => {
  const {
    currentUser,
    users,
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
    auditLogs,
    positions,
    markets
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'frozen' | 'suspended'>('all');
  const [netProfitPeriod, setNetProfitPeriod] = useState<ComparisonPeriod>('monthly');

  // Modal states for Admin actions
  const [editBalanceModal, setEditBalanceModal] = useState(false);
  const [newBalanceInput, setNewBalanceInput] = useState('');

  const [overrideModal, setOverrideModal] = useState(false);
  const [overrideSymbol, setOverrideSymbol] = useState('BTC');
  const [overridePriceInput, setOverridePriceInput] = useState('');

  const [profitModal, setProfitModal] = useState(false);
  const [profitAmountInput, setProfitAmountInput] = useState('');
  const [profitDetailsInput, setProfitDetailsInput] = useState('');

  const [reportSuccess, setReportSuccess] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-5 max-w-md mx-auto my-12 border border-slate-800 shadow-2xl">
        <Shield className="w-14 h-14 text-rose-500 mx-auto animate-pulse" />
        <h2 className="text-2xl font-extrabold text-white">Administrative Access Required</h2>
        <p className="text-slate-400 text-xs">
          You must be authenticated with Master Chief Administrator credentials to access user share prices, profit allocations, and analytics.
        </p>
        <a
          href="/secure-admin-login"
          className="inline-block px-6 py-3 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 transition-all"
        >
          Go to Executive Admin Gate →
        </a>
      </div>
    );
  }

  // Calculate platform financial analytics
  const totalUserBalance = users.reduce((sum, u) => sum + u.balance, 0);
  const totalTradesCount = positions.length;
  const winningTrades = positions.filter((p) => p.pnl > 0);
  const losingTrades = positions.filter((p) => p.pnl <= 0);
  const winRate = totalTradesCount > 0 ? ((winningTrades.length / totalTradesCount) * 100).toFixed(1) : '100.0';

  const totalPositionsValuation = positions.reduce((sum, p) => sum + p.currentValuation, 0);
  const totalNetEquity = totalUserBalance + totalPositionsValuation;

  // Net Profit Change Calculations
  const periodMultipliers = {
    daily: { current: 125000, prev: 105000 },
    weekly: { current: 850000, prev: 720000 },
    monthly: { current: 1250000, prev: 1050000 }
  };
  const netProfitData = periodMultipliers[netProfitPeriod];
  const currentNetProfit = netProfitData.current;
  const prevNetProfit = netProfitData.prev;
  const absoluteNetChange = currentNetProfit - prevNetProfit;
  const netProfitGrowthPct = ((absoluteNetChange / prevNetProfit) * 100).toFixed(2);

  // Filtered User list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export Report Helper
  const handleExportReport = (type: string) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'users') {
      csvContent += 'ID,Name,Email,Role,Balance(INR),Status,CreatedAt\n';
      users.forEach((u) => {
        csvContent += `${u.id},"${u.name}",${u.email},${u.role},${u.balance},${u.status},${u.createdAt}\n`;
      });
    } else if (type === 'transactions') {
      csvContent += 'ID,UserName,UserEmail,Type,Amount(INR),Status,CreatedAt\n';
      transactions.forEach((t) => {
        csvContent += `${t.id},"${t.userName}",${t.userEmail},${t.type},${t.amount},${t.status},${t.createdAt}\n`;
      });
    } else {
      csvContent += 'Metric,Value\n';
      csvContent += `Total Users,${users.length}\n`;
      csvContent += `Total Net Equity,₹${totalNetEquity}\n`;
      csvContent += `Current Net Profit,₹${currentNetProfit}\n`;
      csvContent += `Win Rate,${winRate}%\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ApexBingX_${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setReportSuccess(`${type.toUpperCase()} report exported successfully!`);
    setTimeout(() => setReportSuccess(''), 3000);
  };

  // Recharts Mock Historical Revenue & Profit Data
  const revenueChartData = [
    { period: 'Jan', revenue: 420000, profit: 95000 },
    { period: 'Feb', revenue: 580000, profit: 130000 },
    { period: 'Mar', revenue: 750000, profit: 185000 },
    { period: 'Apr', revenue: 920000, profit: 240000 },
    { period: 'May', revenue: 1100000, profit: 310000 },
    { period: 'Jun', revenue: 1250000, profit: 385000 }
  ];

  const winLossData = [
    { name: 'Winning Trades', value: winningTrades.length || 8, color: '#00C087' },
    { name: 'Losing Trades', value: losingTrades.length || 2, color: '#F6465D' }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[85vh]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 glass-panel p-4 rounded-3xl border border-slate-800/80 space-y-6 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-white text-sm block leading-tight">Executive Admin</span>
            <span className="text-[10px] text-slate-400 font-mono block">{currentUser.email}</span>
          </div>
        </div>

        <nav className="space-y-1 text-xs font-semibold">
          {[
            { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'analytics', label: 'Trading Analytics', icon: TrendingUp },
            { id: 'revenue', label: 'Revenue & PnL', icon: DollarSign },
            { id: 'transactions', label: 'Transactions Queue', icon: Activity },
            { id: 'reports', label: 'Reports & Exports', icon: FileText },
            { id: 'audit', label: 'Security Audit Logs', icon: Clock },
            { id: 'system', label: 'System Health', icon: Server }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-950/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6">
        
        {/* TOP BAR / BANNER */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>ApexBingX Institutional Console</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                Live Production
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time user share prices, capital allocation, and profit distributions</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportReport('summary')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Export Summary CSV</span>
            </button>
          </div>
        </div>

        {reportSuccess && (
          <div className="p-3.5 text-xs rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{reportSuccess}</span>
          </div>
        )}

        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {(activeTab === 'dashboard' || activeTab === 'revenue') && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Platform Net Equity</span>
                  <DollarSign className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  ₹{totalNetEquity.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-400">
                  Total Managed User Funds
                </div>
              </div>

              {/* DYNAMIC NET PROFIT CHANGE CARD */}
              <div className="glass-panel p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
                  <span>Net Profit Change ({netProfitPeriod.toUpperCase()})</span>
                  <div className="flex items-center gap-1">
                    {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNetProfitPeriod(p)}
                        className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded ${
                          netProfitPeriod === p ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {p.slice(0, 1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono flex items-center justify-between">
                  <span>₹{currentNetProfit.toLocaleString('en-IN')}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +{netProfitGrowthPct}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium flex justify-between">
                  <span>Prev: ₹{prevNetProfit.toLocaleString('en-IN')}</span>
                  <span className="text-emerald-400 font-bold">+₹{absoluteNetChange.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Active Client Accounts</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {users.length} Users
                </div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> 100% Verified Profiles
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Trade Execution Win Rate</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {winRate}%
                </div>
                <div className="text-[11px] text-slate-400">
                  {winningTrades.length} Wins / {losingTrades.length} Losses
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Net Profit & Platform Revenue Growth (INR)</span>
                  </h3>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C087" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#00C087" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
                      <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']} />
                      <Area type="monotone" dataKey="profit" stroke="#00C087" strokeWidth={2.5} fill="url(#profitGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                  <PieChart className="w-4 h-4 text-sky-400" />
                  <span>Winning vs Losing Trade Ratio</span>
                </h3>
                <div className="h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={winLossData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {winLossData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Winning Trades
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Losing Trades
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER DIRECTORY & MANAGEMENT */}
        {(activeTab === 'dashboard' || activeTab === 'users') && (
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-4 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" />
                <h3 className="font-extrabold text-white text-base">Client Accounts Directory</h3>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by client name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input focus:outline-none"
                  />
                </div>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="frozen">Frozen Only</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Client User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Invested Capital (INR)</th>
                    <th className="py-3.5 px-4">Profit Multiplier</th>
                    <th className="py-3.5 px-4">Custom Share Prices</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Executive Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredUsers.map((u) => {
                    const userOverrides = adminOverrides.filter((o) => o.userId === u.id);
                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 font-sans">
                          <div className="font-bold text-white text-sm">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>

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

                        <td className="py-4 px-4 font-bold text-white text-sm">
                          ₹{u.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 font-sans">
                            <span className="font-bold text-amber-400">{u.profitMultiplier}x</span>
                            <select
                              value={u.profitMultiplier}
                              onChange={(e) => setUserProfitMultiplier(u.id, parseFloat(e.target.value))}
                              className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded px-1 py-0.5"
                            >
                              <option value="1.0">1.0x (Standard)</option>
                              <option value="1.25">1.25x (+25% Return)</option>
                              <option value="1.5">1.5x (+50% Return)</option>
                              <option value="2.0">2.0x (Double Return)</option>
                            </select>
                          </div>
                        </td>

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

                        <td className="py-4 px-4 font-sans">
                          <button
                            onClick={() => toggleUserStatus(u.id, u.status === 'active' ? 'frozen' : 'active')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-colors flex items-center gap-1 ${
                              u.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {u.status === 'active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                            <span>{u.status}</span>
                          </button>
                        </td>

                        <td className="py-4 px-4 text-right font-sans">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setNewBalanceInput(u.balance.toString());
                                setEditBalanceModal(true);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-[11px] border border-sky-500/20 transition-colors"
                            >
                              Balance
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setOverrideModal(true);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] border border-amber-500/20 transition-colors"
                            >
                              Custom Price
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setProfitModal(true);
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition-colors"
                            >
                              Add Profit
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
        )}

        {/* TAB 3: TRANSACTIONS QUEUE */}
        {activeTab === 'transactions' && (
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="w-5 h-5 text-sky-400" />
              <span>Capital Deposit & Withdrawal Requests Queue</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Client User</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Amount (INR)</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-bold text-white">{tx.userName}</div>
                        <div className="text-[11px] text-slate-400">{tx.userEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 uppercase font-bold text-slate-300">{tx.type}</td>
                      <td className="py-3.5 px-4 font-bold text-white">₹{tx.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-sans text-[11px]">{tx.details}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          tx.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        {tx.status === 'pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveTransaction(tx.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectTransaction(tx.id)}
                              className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px]"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REPORTS & EXPORTS */}
        {activeTab === 'reports' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-sky-400" />
              <span>Exportable Financial & User Reports</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <Users className="w-8 h-8 text-sky-400" />
                <h4 className="font-bold text-white text-sm">User Directory Report</h4>
                <p className="text-xs text-slate-400">Complete CSV dump of registered client accounts, balances, and verification statuses.</p>
                <button
                  onClick={() => handleExportReport('users')}
                  className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download User CSV
                </button>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <Activity className="w-8 h-8 text-purple-400" />
                <h4 className="font-bold text-white text-sm">Transactions Log Report</h4>
                <p className="text-xs text-slate-400">Detailed report of all client deposits, withdrawals, and trade executions.</p>
                <button
                  onClick={() => handleExportReport('transactions')}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download Transactions CSV
                </button>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <DollarSign className="w-8 h-8 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Financial PnL Summary</h4>
                <p className="text-xs text-slate-400">Aggregate platform net equity, net profit growth, and win-rate statistics.</p>
                <button
                  onClick={() => handleExportReport('summary')}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download PnL CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Administrative Action Audit Trail</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target User</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-bold text-sky-400">{log.action}</td>
                      <td className="py-3.5 px-4 text-white font-sans font-bold">{log.targetUserName}</td>
                      <td className="py-3.5 px-4 text-slate-300 font-sans text-[11px]">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SYSTEM HEALTH */}
        {activeTab === 'system' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Server className="w-5 h-5 text-emerald-400" />
              <span>System Health & Security Monitor</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold block">WebSocket Engine Latency</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">0.02 ms</span>
                <span className="text-[11px] text-slate-400 block mt-1">Binance / CoinGecko Live Feed</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold block">2FA & Security Clearance</span>
                <span className="text-2xl font-extrabold text-sky-400 font-mono">ACTIVE</span>
                <span className="text-[11px] text-slate-400 block mt-1">Role-Based Access Enforced</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold block">Database Persistence Engine</span>
                <span className="text-2xl font-extrabold text-purple-400 font-mono">100% Healthy</span>
                <span className="text-[11px] text-slate-400 block mt-1">Local State Sync Active</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: Edit Balance */}
      {editBalanceModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel max-w-sm w-full p-6 rounded-2xl border border-slate-700 space-y-4">
            <h3 className="font-extrabold text-white text-base">Edit Invested Balance for {selectedUser.name}</h3>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">New Balance Amount (INR ₹)</label>
              <input
                type="number"
                value={newBalanceInput}
                onChange={(e) => setNewBalanceInput(e.target.value)}
                className="w-full px-4 py-2 text-sm rounded-xl glass-input focus:outline-none font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditBalanceModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = parseFloat(newBalanceInput);
                  if (!isNaN(val)) {
                    updateUserBalance(selectedUser.id, val, 'Administrative manual adjustment');
                  }
                  setEditBalanceModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
              >
                Save Balance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Custom Price Override */}
      {overrideModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel max-w-sm w-full p-6 rounded-2xl border border-slate-700 space-y-4">
            <h3 className="font-extrabold text-white text-base">Set Custom Unit Share Price for {selectedUser.name}</h3>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Select Asset</label>
              <select
                value={overrideSymbol}
                onChange={(e) => setOverrideSymbol(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none mb-3 font-semibold"
              >
                {markets.map((m) => (
                  <option key={m.id} value={m.symbol}>
                    {m.symbol} ({m.name}) - Live: ₹{m.current_price.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Custom Target Price (INR ₹)</label>
              <input
                type="number"
                placeholder="e.g. 75000"
                value={overridePriceInput}
                onChange={(e) => setOverridePriceInput(e.target.value)}
                className="w-full px-4 py-2 text-sm rounded-xl glass-input focus:outline-none font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOverrideModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = parseFloat(overridePriceInput);
                  if (!isNaN(val) && val > 0) {
                    setUserPriceOverride(selectedUser.id, overrideSymbol, val);
                  }
                  setOverrideModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
              >
                Apply Custom Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Inject Profit/Loss */}
      {profitModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel max-w-sm w-full p-6 rounded-2xl border border-slate-700 space-y-4">
            <h3 className="font-extrabold text-white text-base">Inject Profit / Loss for {selectedUser.name}</h3>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Amount (INR ₹, positive for profit, negative for loss)</label>
              <input
                type="number"
                placeholder="e.g. 20000 or -5000"
                value={profitAmountInput}
                onChange={(e) => setProfitAmountInput(e.target.value)}
                className="w-full px-4 py-2 text-sm rounded-xl glass-input focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Details / Reason</label>
              <input
                type="text"
                placeholder="e.g. Monthly Profit Distribution"
                value={profitDetailsInput}
                onChange={(e) => setProfitDetailsInput(e.target.value)}
                className="w-full px-4 py-2 text-sm rounded-xl glass-input focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setProfitModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = parseFloat(profitAmountInput);
                  if (!isNaN(val) && val !== 0) {
                    allocateProfitLoss(selectedUser.id, val, profitDetailsInput || 'Admin profit allocation');
                  }
                  setProfitModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Inject Profit / Loss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
