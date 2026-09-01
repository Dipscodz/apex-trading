'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CryptoMarketData } from '@/types';
import { TrendingUp, TrendingDown, ShieldAlert, CheckCircle2, DollarSign, Zap } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface TradeOrderPanelProps {
  coin: CryptoMarketData;
  effectivePrice: number;
}

export const TradeOrderPanel: React.FC<TradeOrderPanelProps> = ({ coin, effectivePrice }) => {
  const { currentUser, openPosition } = useApp();
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('0.1');
  const [leverage, setLeverage] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const positionValuation = numAmount * effectivePrice;
  const marginRequired = positionValuation / leverage;

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    if (numAmount <= 0) {
      setError('Please enter a valid order size.');
      return;
    }

    const res = openPosition(coin.symbol, orderType, numAmount, leverage);
    if (res.success) {
      setSuccess(res.message);
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(res.message);
    }
  };

  const handlePercentageSelect = (pct: number) => {
    if (!currentUser || currentUser.balance <= 0) return;
    const targetMargin = (currentUser.balance * pct) / 100;
    const cryptoUnits = (targetMargin * leverage) / effectivePrice;
    setAmount(cryptoUnits.toFixed(coin.current_price < 1 ? 2 : 4));
  };

  return (
    <>
      <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        
        {/* Header Tabs: BUY vs SELL */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 font-bold text-xs">
          <button
            type="button"
            onClick={() => setOrderType('buy')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              orderType === 'buy'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>BUY / LONG</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType('sell')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              orderType === 'sell'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>SELL / SHORT</span>
          </button>
        </div>

        {/* Form Notifications */}
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-xs rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleTrade} className="space-y-4">
          
          {/* Order Size */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Order Size ({coin.symbol})</span>
              <span className="text-slate-400 text-[11px]">
                Est. Price: ${effectivePrice.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-4 pr-16 py-2.5 font-mono text-sm rounded-xl glass-input focus:outline-none font-bold"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                {coin.symbol}
              </span>
            </div>
          </div>

          {/* Quick Balance Percentage Pickers */}
          {currentUser && (
            <div className="grid grid-cols-4 gap-1.5 text-[11px] font-semibold">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentageSelect(pct)}
                  className="py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>
          )}

          {/* Leverage Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Execution Leverage</span>
              <span className="text-sky-400 font-mono font-bold">{leverage}x</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-xs font-bold">
              {[1, 2, 5, 10, 20].map((lev) => (
                <button
                  key={lev}
                  type="button"
                  onClick={() => setLeverage(lev)}
                  className={`py-1.5 rounded-lg border transition-all ${
                    leverage === lev
                      ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lev}x
                </button>
              ))}
            </div>
          </div>

          {/* Trade Summary breakdown */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Position Value:</span>
              <span className="text-white font-bold">${positionValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Required Margin:</span>
              <span className="text-sky-400 font-bold">${marginRequired.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            {currentUser && (
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                <span>Available Cash:</span>
                <span className={`font-bold ${currentUser.balance >= marginRequired ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          {currentUser ? (
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-extrabold text-sm text-white flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.01] ${
                orderType === 'buy'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/40'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {orderType === 'buy' ? 'EXECUTE BUY ORDER' : 'EXECUTE SELL ORDER'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="w-full py-3 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-500 text-white shadow-lg transition-all"
            >
              Sign In to Execute Live Trade
            </button>
          )}
        </form>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab="login"
      />
    </>
  );
};
