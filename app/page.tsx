'use client';

import React from 'react';
import { MarketOverview } from '@/components/MarketOverview';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Live Crypto Markets & Terminal
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Track real-time cryptocurrency asset prices, analyze live market orderflows, and execute trades instantly with institutional speed.
        </p>
      </div>

      <MarketOverview />
    </div>
  );
}
