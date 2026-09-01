'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  CryptoMarketData,
  TradePosition,
  UserPriceOverride,
  TransactionRecord,
  AdminAuditLog
} from '@/types';
import { INITIAL_CRYPTO_DATA, fetchLiveCryptoMarkets } from '@/lib/cryptoService';

interface AppContextType {
  // Auth state
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => { success: boolean; message: string };
  verifyCredentials: (email: string, password: string) => { success: boolean; message: string };
  signup: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;

  // Market Data
  markets: CryptoMarketData[];
  getEffectivePrice: (symbol: string, targetUserId?: string) => number;
  
  // Trade Positions
  positions: TradePosition[];
  openPosition: (symbol: string, type: 'buy' | 'sell', amount: number, leverage: number) => { success: boolean; message: string };
  closePosition: (positionId: string) => { success: boolean; message: string };

  // Financial Requests
  transactions: TransactionRecord[];
  requestDeposit: (amount: number) => { success: boolean; message: string };
  requestWithdrawal: (amount: number) => { success: boolean; message: string };

  // Admin Controls
  adminOverrides: UserPriceOverride[];
  auditLogs: AdminAuditLog[];
  updateUserBalance: (targetUserId: string, newBalance: number, reason?: string) => void;
  setUserPriceOverride: (targetUserId: string, symbol: string, customPrice: number) => void;
  removeUserPriceOverride: (targetUserId: string, symbol: string) => void;
  allocateProfitLoss: (targetUserId: string, amount: number, details: string) => void;
  setUserProfitMultiplier: (targetUserId: string, multiplier: number) => void;
  toggleUserStatus: (targetUserId: string, status: 'active' | 'frozen' | 'suspended') => void;
  approveTransaction: (transactionId: string) => void;
  rejectTransaction: (transactionId: string) => void;
  
  // System Utility
  resetToDefaultData: () => void;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Chief Admin',
    email: 'admin@apexquantum.io',
    password: 'AdminApex2026!',
    role: 'admin',
    balance: 150000.00,
    profitMultiplier: 1.0,
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    lastLogin: '2026-09-01T20:00:00Z',
    notes: 'System administrator account',
  },
  {
    id: 'usr_trader_01',
    name: 'Institutional Client',
    email: 'trader@apexquantum.io',
    password: 'trader123',
    role: 'user',
    balance: 35000.00,
    profitMultiplier: 1.2,
    status: 'active',
    createdAt: '2026-02-15T14:30:00Z',
    lastLogin: '2026-09-01T19:45:00Z',
    notes: 'Premium investor tier',
  },
  {
    id: 'usr_trader_02',
    name: 'Alexander Wright',
    email: 'alex.wright@quantumcap.com',
    password: 'alex123',
    role: 'user',
    balance: 50000.00,
    profitMultiplier: 1.0,
    status: 'active',
    createdAt: '2026-03-20T09:15:00Z',
    lastLogin: '2026-09-01T18:10:00Z',
    notes: 'Standard account',
  }
];

const DEFAULT_POSITIONS: TradePosition[] = [
  {
    id: 'pos_01',
    userId: 'usr_trader_01',
    symbol: 'BTC',
    coinName: 'Bitcoin',
    type: 'buy',
    entryPrice: 62500.00,
    currentPrice: 64280.50,
    amount: 0.25,
    totalInvested: 15625.00,
    currentValuation: 16070.12,
    leverage: 1,
    pnl: 445.12,
    pnlPercentage: 2.85,
    status: 'open',
    createdAt: '2026-08-28T11:20:00Z',
  },
  {
    id: 'pos_02',
    userId: 'usr_trader_01',
    symbol: 'SOL',
    coinName: 'Solana',
    type: 'buy',
    entryPrice: 145.00,
    currentPrice: 154.80,
    amount: 40.0,
    totalInvested: 5800.00,
    currentValuation: 6192.00,
    leverage: 2,
    pnl: 784.00,
    pnlPercentage: 13.51,
    status: 'open',
    createdAt: '2026-08-30T15:10:00Z',
  }
];

const DEFAULT_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx_101',
    userId: 'usr_trader_01',
    userName: 'Institutional Client',
    userEmail: 'trader@apexquantum.io',
    type: 'deposit',
    amount: 30000,
    status: 'completed',
    details: 'Initial Wire Deposit',
    createdAt: '2026-02-15T14:35:00Z',
  },
  {
    id: 'tx_102',
    userId: 'usr_trader_01',
    userName: 'Institutional Client',
    userEmail: 'trader@apexquantum.io',
    type: 'trade_buy',
    amount: 15625,
    assetSymbol: 'BTC',
    status: 'completed',
    details: 'Buy 0.25 BTC @ $62,500',
    createdAt: '2026-08-28T11:20:00Z',
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'apex_quantum_app_state_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markets, setMarkets] = useState<CryptoMarketData[]>(INITIAL_CRYPTO_DATA);
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(DEFAULT_USERS[1]); // Default logged in as demo client
  const [positions, setPositions] = useState<TradePosition[]>(DEFAULT_POSITIONS);
  const [adminOverrides, setAdminOverrides] = useState<UserPriceOverride[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(DEFAULT_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        if (parsed.positions) setPositions(parsed.positions);
        if (parsed.adminOverrides) setAdminOverrides(parsed.adminOverrides);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      }
    } catch {
      console.warn('Failed to parse saved state from local storage');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save state to localStorage on updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          users,
          currentUser,
          positions,
          adminOverrides,
          transactions,
          auditLogs,
        })
      );
    } catch {
      console.warn('Failed to save state to local storage');
    }
  }, [users, currentUser, positions, adminOverrides, transactions, auditLogs, isLoaded]);

  // Initial market fetch + Live Ticker simulation
  useEffect(() => {
    fetchLiveCryptoMarkets().then((data) => {
      setMarkets(data);
    });

    const interval = setInterval(() => {
      setMarkets((prevMarkets) =>
        prevMarkets.map((coin) => {
          // Slight price oscillation (-0.4% to +0.4%)
          const pct = (Math.random() - 0.48) * 0.008;
          const newPrice = Math.max(0.0001, coin.current_price * (1 + pct));
          const change = newPrice - coin.current_price;
          return {
            ...coin,
            current_price: Number(newPrice.toFixed(coin.current_price < 1 ? 4 : 2)),
            high_24h: Math.max(coin.high_24h, newPrice),
            low_24h: Math.min(coin.low_24h, newPrice),
            price_change_24h: coin.price_change_24h + change,
            price_change_percentage_24h: Number(
              (coin.price_change_percentage_24h + pct * 100).toFixed(2)
            ),
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Recalculate positions P&L dynamically based on market prices & admin overrides
  useEffect(() => {
    setPositions((prevPositions) =>
      prevPositions.map((pos) => {
        const effectivePrice = getEffectivePrice(pos.symbol, pos.userId);
        const priceDiff = effectivePrice - pos.entryPrice;
        const multiplier = users.find((u) => u.id === pos.userId)?.profitMultiplier || 1.0;
        
        let pnl = 0;
        if (pos.type === 'buy') {
          pnl = priceDiff * pos.amount * pos.leverage * multiplier;
        } else {
          pnl = (pos.entryPrice - effectivePrice) * pos.amount * pos.leverage * multiplier;
        }

        if (pos.customPnlAdjustment) {
          pnl += pos.customPnlAdjustment;
        }

        const currentValuation = pos.totalInvested + pnl;
        const pnlPercentage = (pnl / pos.totalInvested) * 100;

        return {
          ...pos,
          currentPrice: effectivePrice,
          currentValuation: Number(currentValuation.toFixed(2)),
          pnl: Number(pnl.toFixed(2)),
          pnlPercentage: Number(pnlPercentage.toFixed(2)),
        };
      })
    );
  }, [markets, adminOverrides, users]);

  // Helper to get price taking into account user price overrides set by Admin
  const getEffectivePrice = (symbol: string, targetUserId?: string): number => {
    const userIdToCheck = targetUserId || currentUser?.id;
    if (userIdToCheck) {
      const override = adminOverrides.find(
        (o) => o.userId === userIdToCheck && o.symbol.toUpperCase() === symbol.toUpperCase()
      );
      if (override && override.overridePrice > 0) {
        return override.overridePrice;
      }
    }
    const marketCoin = markets.find((m) => m.symbol.toUpperCase() === symbol.toUpperCase());
    return marketCoin ? marketCoin.current_price : 0;
  };

  const verifyCredentials = (email: string, pass: string) => {
    const formattedEmail = email.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === formattedEmail && (u.password === pass || !u.password)
    );

    if (!found) {
      return { success: false, message: 'Invalid email or password.' };
    }

    if (found.status === 'frozen' || found.status === 'suspended') {
      return { success: false, message: 'Account suspended or pending verification.' };
    }

    return { success: true, message: `Credentials verified for ${found.name}` };
  };

  const login = (email: string, pass: string) => {
    const formattedEmail = email.trim().toLowerCase();
    
    // Check master admin login override shortcut
    if (formattedEmail === 'admin@apexquantum.io' && (pass === 'AdminApex2026!' || pass === 'admin123')) {
      const adminUser = users.find((u) => u.role === 'admin') || DEFAULT_USERS[0];
      setCurrentUser(adminUser);
      return { success: true, message: 'Welcome back, Chief Admin!' };
    }

    const found = users.find((u) => u.email.toLowerCase() === formattedEmail);
    if (!found) {
      return { success: false, message: 'Invalid credentials. User account not found.' };
    }

    if (found.status === 'frozen' || found.status === 'suspended') {
      return { success: false, message: 'Account suspended or pending verification. Please contact support.' };
    }

    const updatedUser = { ...found, lastLogin: new Date().toISOString() };
    setUsers((prev) => prev.map((u) => (u.id === found.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    return { success: true, message: `Welcome back, ${found.name}` };
  };

  const signup = (name: string, email: string, pass: string) => {
    const formattedEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === formattedEmail)) {
      return { success: false, message: 'Email address already registered.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: formattedEmail,
      password: pass,
      role: 'user',
      balance: 10000.00, // Welcome starting capital
      profitMultiplier: 1.0,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Record welcome deposit
    const welcomeTx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      userId: newUser.id,
      userName: newUser.name,
      userEmail: newUser.email,
      type: 'deposit',
      amount: 10000.00,
      status: 'completed',
      details: 'Welcome Bonus Credit',
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [welcomeTx, ...prev]);

    return { success: true, message: 'Registration successful! Welcome to Apex Quantum.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Open Position (Buy / Sell)
  const openPosition = (symbol: string, type: 'buy' | 'sell', amount: number, leverage: number) => {
    if (!currentUser) {
      return { success: false, message: 'Please log in to execute trade.' };
    }
    if (currentUser.status !== 'active') {
      return { success: false, message: 'Account is not active for live trading.' };
    }

    const currentMktPrice = getEffectivePrice(symbol, currentUser.id);
    if (currentMktPrice <= 0) {
      return { success: false, message: 'Invalid asset or market price unavailable.' };
    }

    const totalCost = (amount * currentMktPrice) / leverage;
    if (currentUser.balance < totalCost) {
      return { success: false, message: `Insufficient balance. Required: $${totalCost.toFixed(2)}` };
    }

    // Deduct balance
    const updatedBalance = currentUser.balance - totalCost;
    const updatedUser = { ...currentUser, balance: updatedBalance };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    const marketCoin = markets.find((m) => m.symbol.toUpperCase() === symbol.toUpperCase());

    const newPos: TradePosition = {
      id: `pos_${Date.now()}`,
      userId: currentUser.id,
      symbol: symbol.toUpperCase(),
      coinName: marketCoin ? marketCoin.name : symbol.toUpperCase(),
      type,
      entryPrice: currentMktPrice,
      currentPrice: currentMktPrice,
      amount,
      totalInvested: Number(totalCost.toFixed(2)),
      currentValuation: Number(totalCost.toFixed(2)),
      leverage,
      pnl: 0,
      pnlPercentage: 0,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    setPositions((prev) => [newPos, ...prev]);

    // Record trade transaction
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: type === 'buy' ? 'trade_buy' : 'trade_sell',
      amount: totalCost,
      assetSymbol: symbol.toUpperCase(),
      status: 'completed',
      details: `${type.toUpperCase()} ${amount} ${symbol.toUpperCase()} @ $${currentMktPrice.toLocaleString()} (${leverage}x)`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    return { success: true, message: `Order Executed: ${type.toUpperCase()} ${amount} ${symbol.toUpperCase()}` };
  };

  // Close Position
  const closePosition = (positionId: string) => {
    const pos = positions.find((p) => p.id === positionId);
    if (!pos || pos.status === 'closed') {
      return { success: false, message: 'Position not found or already closed.' };
    }

    const returnAmount = pos.currentValuation;
    
    // Update user balance
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === pos.userId) {
          const newBal = u.balance + returnAmount;
          if (currentUser && currentUser.id === u.id) {
            setCurrentUser({ ...currentUser, balance: newBal });
          }
          return { ...u, balance: newBal };
        }
        return u;
      })
    );

    // Mark position closed
    setPositions((prev) =>
      prev.map((p) => (p.id === positionId ? { ...p, status: 'closed', closedAt: new Date().toISOString() } : p))
    );

    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      userId: pos.userId,
      userName: users.find((u) => u.id === pos.userId)?.name || 'User',
      userEmail: users.find((u) => u.id === pos.userId)?.email || '',
      type: 'trade_sell',
      amount: returnAmount,
      assetSymbol: pos.symbol,
      status: 'completed',
      details: `Closed Position ${pos.symbol} with PnL: $${pos.pnl > 0 ? '+' : ''}${pos.pnl.toFixed(2)}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    return { success: true, message: `Position closed. Return: $${returnAmount.toFixed(2)}` };
  };

  // Deposits & Withdrawals
  const requestDeposit = (amount: number) => {
    if (!currentUser) return { success: false, message: 'Not authenticated' };
    if (amount <= 0) return { success: false, message: 'Invalid deposit amount' };

    // Auto-approve deposit for seamless user demo experience
    const newBalance = currentUser.balance + amount;
    const updatedUser = { ...currentUser, balance: newBalance };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'deposit',
      amount,
      status: 'completed',
      details: 'Instant Bank Wire Deposit',
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    return { success: true, message: `Deposit of $${amount.toLocaleString()} credited successfully!` };
  };

  const requestWithdrawal = (amount: number) => {
    if (!currentUser) return { success: false, message: 'Not authenticated' };
    if (amount <= 0 || amount > currentUser.balance) {
      return { success: false, message: 'Insufficient wallet balance for withdrawal' };
    }

    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'withdrawal',
      amount,
      status: 'pending',
      details: 'Withdrawal request to external bank account',
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    return { success: true, message: `Withdrawal request for $${amount.toLocaleString()} submitted for compliance review.` };
  };

  // Admin Controls
  const updateUserBalance = (targetUserId: string, newBalance: number, reason?: string) => {
    const targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === targetUserId ? { ...u, balance: Number(newBalance.toFixed(2)) } : u))
    );

    if (currentUser?.id === targetUserId) {
      setCurrentUser((prev) => (prev ? { ...prev, balance: Number(newBalance.toFixed(2)) } : null));
    }

    // Log action
    const log: AdminAuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser?.id || 'admin',
      targetUserId,
      targetUserName: targetUser.name,
      action: 'BALANCE_UPDATE',
      details: `Set wallet balance to $${newBalance.toLocaleString()}. Reason: ${reason || 'Administrative adjustment'}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const setUserPriceOverride = (targetUserId: string, symbol: string, customPrice: number) => {
    const sym = symbol.toUpperCase();
    const targetUser = users.find((u) => u.id === targetUserId);

    setAdminOverrides((prev) => {
      const filtered = prev.filter((o) => !(o.userId === targetUserId && o.symbol === sym));
      if (customPrice <= 0) return filtered;
      return [
        ...filtered,
        {
          userId: targetUserId,
          symbol: sym,
          overridePrice: customPrice,
          updatedAt: new Date().toISOString(),
        },
      ];
    });

    const log: AdminAuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser?.id || 'admin',
      targetUserId,
      targetUserName: targetUser?.name || 'User',
      action: 'PRICE_OVERRIDE',
      details: `Set custom ${sym} unit price to $${customPrice.toLocaleString()} for ${targetUser?.name}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const removeUserPriceOverride = (targetUserId: string, symbol: string) => {
    setUserPriceOverride(targetUserId, symbol, 0);
  };

  const allocateProfitLoss = (targetUserId: string, amount: number, details: string) => {
    const targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) return;

    const newBalance = targetUser.balance + amount;
    updateUserBalance(targetUserId, newBalance, details);

    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      userId: targetUserId,
      userName: targetUser.name,
      userEmail: targetUser.email,
      type: 'profit_payout',
      amount,
      status: 'completed',
      details: `Admin Adjustment: ${details} ($${amount > 0 ? '+' : ''}${amount.toLocaleString()})`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  const setUserProfitMultiplier = (targetUserId: string, multiplier: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUserId ? { ...u, profitMultiplier: multiplier } : u))
    );
  };

  const toggleUserStatus = (targetUserId: string, status: 'active' | 'frozen' | 'suspended') => {
    setUsers((prev) => prev.map((u) => (u.id === targetUserId ? { ...u, status } : u)));
  };

  const approveTransaction = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx || tx.status !== 'pending') return;

    if (tx.type === 'withdrawal') {
      const targetUser = users.find((u) => u.id === tx.userId);
      if (targetUser && targetUser.balance >= tx.amount) {
        const newBal = targetUser.balance - tx.amount;
        setUsers((prev) => prev.map((u) => (u.id === tx.userId ? { ...u, balance: newBal } : u)));
        if (currentUser?.id === tx.userId) {
          setCurrentUser((prev) => (prev ? { ...prev, balance: newBal } : null));
        }
      }
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'completed' } : t))
    );
  };

  const rejectTransaction = (txId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'rejected' } : t))
    );
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUsers(DEFAULT_USERS);
    setCurrentUser(DEFAULT_USERS[1]);
    setPositions(DEFAULT_POSITIONS);
    setAdminOverrides([]);
    setTransactions(DEFAULT_TRANSACTIONS);
    setAuditLogs([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        login,
        verifyCredentials,
        signup,
        logout,
        markets,
        getEffectivePrice,
        positions,
        openPosition,
        closePosition,
        transactions,
        requestDeposit,
        requestWithdrawal,
        adminOverrides,
        auditLogs,
        updateUserBalance,
        setUserPriceOverride,
        removeUserPriceOverride,
        allocateProfitLoss,
        setUserProfitMultiplier,
        toggleUserStatus,
        approveTransaction,
        rejectTransaction,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
