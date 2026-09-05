'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Zap,
  BarChart2,
  DollarSign,
  ShieldAlert
} from 'lucide-react';

export const MarketOverview: React.FC = () => {
  const { markets, currentUser, getEffectivePrice } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  const filteredMarkets = markets.filter((coin) => {
    const matchesSearch =
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase());
    if (filter === 'gainers') return matchesSearch && coin.price_change_percentage_24h > 0;
    if (filter === 'losers') return matchesSearch && coin.price_change_percentage_24h < 0;
    return matchesSearch;
  });

  const topGainer = [...markets].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)[0];
  const btcPrice = markets.find((m) => m.symbol === 'BTC')?.current_price || 64280;

  return (
    <div className="space-y-6">
      {/* Top Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Bitcoin Index (INR)</span>
            <span className="text-xl font-extrabold text-white font-mono leading-tight">
              ₹{btcPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> BingX INR Spot Index
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Top 24h Gainer</span>
            <span className="text-xl font-extrabold text-white font-mono leading-tight">
              {topGainer?.symbol || 'SOL'}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +{topGainer?.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">24h Aggregate Volume</span>
            <span className="text-xl font-extrabold text-white font-mono leading-tight">
              ₹4,85,000 Cr
            </span>
            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
              Institutional Orderflow
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Trading Execution</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono leading-tight">
              Ultra Low Latency
            </span>
            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
              0.00ms BingX Engine
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Market Controls & Search */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search crypto assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium w-full md:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'all' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            All Cryptos ({markets.length})
          </button>
          <button
            onClick={() => setFilter('gainers')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'gainers' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Top Gainers
          </button>
          <button
            onClick={() => setFilter('losers')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'losers' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Top Losers
          </button>
        </div>
      </div>

      {/* Markets Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Asset</th>
                <th className="py-3.5 px-4">Effective Price (INR)</th>
                <th className="py-3.5 px-4">24h Change</th>
                <th className="py-3.5 px-4 hidden md:table-cell">24h High / Low</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Market Cap (INR)</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredMarkets.map((coin, index) => {
                const effectivePrice = getEffectivePrice(coin.symbol, currentUser?.id);
                const isPriceOverridden = effectivePrice !== coin.current_price;
                const isPositive = coin.price_change_percentage_24h >= 0;

                return (
                  <tr
                    key={coin.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-4 px-4 text-slate-500 font-sans font-bold">{index + 1}</td>
                    
                    {/* Coin Info */}
                    <td className="py-4 px-4 font-sans">
                      <div className="flex items-center gap-3">
                        <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full bg-slate-800 p-0.5" />
                        <div>
                          <span className="font-bold text-white block text-sm group-hover:text-sky-400 transition-colors">
                            {coin.name}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            {coin.symbol} / INR
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-white text-sm">
                      <div className="flex items-center gap-2">
                        <span>₹{effectivePrice.toLocaleString('en-IN', { minimumFractionDigits: coin.current_price < 1 ? 4 : 2 })}</span>
                        {isPriceOverridden && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            Custom Rate
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 24h Change */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg ${
                          isPositive
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                            : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                        }`}
                      >
                        {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </td>

                    {/* High/Low */}
                    <td className="py-4 px-4 hidden md:table-cell text-slate-400">
                      <div>
                        <span className="text-emerald-400 font-semibold block">₹{coin.high_24h.toLocaleString('en-IN')}</span>
                        <span className="text-slate-500 text-[10px] block">₹{coin.low_24h.toLocaleString('en-IN')}</span>
                      </div>
                    </td>

                    {/* Market Cap */}
                    <td className="py-4 px-4 hidden lg:table-cell text-slate-300 font-sans">
                      ₹{(coin.market_cap / 1e7).toFixed(2)} Cr
                    </td>

                    {/* Trade Button */}
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/trade/${coin.symbol}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-sans font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-900/30 transition-all hover:scale-105"
                      >
                        <span>Trade</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
