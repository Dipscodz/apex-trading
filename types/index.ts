export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  balance: number; // Cash balance in USD
  profitMultiplier: number; // e.g., 1.0 (default), 1.25, 1.5
  status: 'active' | 'frozen' | 'suspended';
  createdAt: string;
  lastLogin: string;
  notes?: string;
}

export interface CryptoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface PricePoint {
  timestamp: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradePosition {
  id: string;
  userId: string;
  symbol: string;
  coinName: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  currentPrice: number;
  amount: number; // Amount of crypto units
  totalInvested: number; // Entry total USD value
  currentValuation: number; // Current USD value
  leverage: number; // 1x, 2x, 5x, 10x, 20x
  pnl: number; // Profit or Loss in USD
  pnlPercentage: number; // PnL %
  customPnlAdjustment?: number; // Admin injected profit/loss
  customPriceOverride?: number; // Admin set unit price for this asset/user
  status: 'open' | 'closed';
  createdAt: string;
  closedAt?: string;
}

export interface UserPriceOverride {
  userId: string;
  symbol: string;
  overridePrice: number;
  updatedAt: string;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'deposit' | 'withdrawal' | 'trade_buy' | 'trade_sell' | 'admin_adjustment' | 'profit_payout';
  amount: number;
  assetSymbol?: string;
  status: 'completed' | 'pending' | 'rejected';
  details: string;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  targetUserId: string;
  targetUserName: string;
  action: string;
  details: string;
  timestamp: string;
}


