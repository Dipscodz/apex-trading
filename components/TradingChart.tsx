'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { CryptoMarketData, PricePoint } from '@/types';
import { generateHistoricalChartData } from '@/lib/cryptoService';
import { TrendingUp, TrendingDown, Clock, BarChart2, Layers } from 'lucide-react';

interface TradingChartProps {
  coin: CryptoMarketData;
  effectivePrice: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({ coin, effectivePrice }) => {
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '1M' | '1Y'>('24H');
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [chartData, setChartData] = useState<PricePoint[]>([]);

  useEffect(() => {
    const data = generateHistoricalChartData(effectivePrice, timeframe);
    setChartData(data);
  }, [effectivePrice, timeframe, coin.id]);

  const isPositive = coin.price_change_percentage_24h >= 0;
  const strokeColor = isPositive ? '#10b981' : '#f43f5e';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';

  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices, effectivePrice) * 0.995;
  const maxPrice = Math.max(...prices, effectivePrice) * 1.005;

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full bg-slate-900 p-1" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">{coin.name}</h2>
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs font-bold">
                {coin.symbol}/USD
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Spot Perpetual Market</span>
          </div>
        </div>

        {/* Price & Stats */}
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Price (USD)</span>
            <span className="text-2xl font-extrabold text-white font-mono leading-tight">
              ${effectivePrice.toLocaleString(undefined, { minimumFractionDigits: effectivePrice < 1 ? 4 : 2 })}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">24h Change</span>
            <span
              className={`text-sm font-bold font-mono flex items-center gap-1 ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>

          <div className="hidden lg:block">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">24h High</span>
            <span className="text-sm font-bold text-white font-mono">
              ${coin.high_24h.toLocaleString()}
            </span>
          </div>

          <div className="hidden lg:block">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">24h Low</span>
            <span className="text-sm font-bold text-white font-mono">
              ${coin.low_24h.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Timeframe Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          {(['1H', '24H', '7D', '1M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeframe === tf ? 'bg-sky-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType(chartType === 'area' ? 'line' : 'area')}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="capitalize">{chartType} Mode</span>
          </button>
        </div>
      </div>

      {/* Recharts Render */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="timestamp"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as PricePoint;
                  return (
                    <div className="glass-panel p-3 rounded-xl border border-slate-700 text-xs space-y-1 shadow-2xl font-mono">
                      <div className="text-slate-400 font-sans font-medium">{data.timestamp}</div>
                      <div className="text-white font-bold text-sm">
                        Price: ${data.price.toLocaleString(undefined, { minimumFractionDigits: data.price < 1 ? 4 : 2 })}
                      </div>
                      <div className="text-slate-300 text-[11px]">High: ${data.high} | Low: ${data.low}</div>
                      <div className="text-slate-400 text-[10px]">Vol: ${data.volume.toLocaleString()}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
