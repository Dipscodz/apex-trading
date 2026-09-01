'use client';

import React from 'react';
import { UserPortfolio } from '@/components/UserPortfolio';

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Client Portfolio & Asset Holdings
        </h1>
        <p className="text-xs text-slate-400">
          Monitor your real-time equity valuation, active order positions, trade history, and capital deposits.
        </p>
      </div>

      <UserPortfolio />
    </div>
  );
}
