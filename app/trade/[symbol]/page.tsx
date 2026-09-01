'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { TradingChart } from '@/components/TradingChart';
import { TradeOrderPanel } from '@/components/TradeOrderPanel';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function TradePage() {
  const params = useParams();
  const rawSymbol = (params?.symbol as string) || 'BTC';
  const symbol = rawSymbol.toUpperCase();

  const { markets, getEffectivePrice, currentUser } = useApp();

  const coin = markets.find((m) => m.symbol.toUpperCase() === symbol) || markets[0];
  const effectivePrice = getEffectivePrice(coin.symbol, currentUser?.id);

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Markets</span>
        </Link>

        {/* Quick Symbol Switcher */}
        <div className="flex items-center gap-2 text-xs font-bold font-mono">
          <span className="text-slate-500 font-sans">Quick Switch:</span>
          {markets.slice(0, 5).map((m) => (
            <Link
              key={m.symbol}
              href={`/trade/${m.symbol}`}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                m.symbol === symbol
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {m.symbol}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Trading Terminal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Financial Chart */}
        <div className="lg:col-span-2">
          <TradingChart coin={coin} effectivePrice={effectivePrice} />
        </div>

        {/* Right Col: Order Execution Panel */}
        <div className="lg:col-span-1">
          <TradeOrderPanel coin={coin} effectivePrice={effectivePrice} />
        </div>
      </div>
    </div>
  );
}
