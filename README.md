# ⚡ Apex Quantum | Institutional Crypto Trading & Management Terminal

Apex Quantum is a high-performance, real-time cryptocurrency trading terminal and portfolio management platform built with Next.js 14, TypeScript, Tailwind CSS, and Recharts.

It provides real-time market streams, interactive financial charts, leveraged trade execution, and an **Executive Admin Console** with complete administrative control over user balances, asset valuations, custom share price overrides, and profit distributions.

---

## 🌟 Key Highlights & Features

### 📊 Real-Time Crypto Markets & Charts
- **Live Market Streaming**: Streaming tickers for top assets including BTC, ETH, SOL, BNB, XRP, ADA, DOGE, AVAX, LINK, SUI, NEAR, DOT.
- **Interactive Financial Charts**: Recharts Area & Line graphs with timeframe selection (`1H`, `24H`, `7D`, `1M`, `1Y`), volume breakdown, and hover inspection tooltips.
- **24h Market Stats**: Aggregate volume tracking, top gainer indicators, and market cap rankings.

### 💼 Client Trading & Portfolio Dashboard
- **Order Execution Engine**: Execute `BUY / LONG` or `SELL / SHORT` trades with configurable leverage (`1x`, `2x`, `5x`, `10x`, `20x`).
- **Live Position Management**: Instant margin calculation, unrealized position P&L tracking, and one-click position exit.
- **Capital Operations**: Instant wire deposit simulation and compliance withdrawal requests.
- **Transaction History**: Complete transaction trail for deposits, orders, and administrative adjustments.

### 🛡️ Executive Admin Command Console (`/admin`)
- **User Directory**: Searchable list of client accounts, balance tracking, and status monitoring.
- **Wallet Cash Editing**: Modify client wallet cash balances directly with audit logging.
- **Custom Share / Asset Price Overrides**: Set custom target unit prices for specific crypto assets on targeted user accounts to adjust asset valuations and share pricing.
- **Profit & Loss Allocation Tool**: Inject custom profit bonuses (+$X) or loss debits (-$Y) with reason notes.
- **Profit Multipliers**: Assign performance multipliers (`1.25x`, `1.5x`, `2.0x`) to client accounts.
- **Withdrawal Approvals**: Review and approve/reject pending client withdrawal requests.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Glassmorphism Design System
- **Charting**: Recharts
- **Icons**: Lucide React
- **State & Persistence**: React Context API with LocalStorage Synchronization
- **Deployment**: Zero-Config Vercel Support

---

## 🔐 Demo Credentials

### 👑 Chief Administrator
- **Email**: `admin@apexquantum.io`
- **Password**: `AdminApex2026!`

### 👤 Institutional Client
- **Email**: `trader@apexquantum.io`
- **Password**: `trader123`

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

### 3. Production Build Validation
```bash
npm run build
```

---

## ☁️ Deployment

This platform is 100% ready for zero-config Vercel deployment:

1. Push code to GitHub repository.
2. Import repository on [Vercel](https://vercel.com).
3. Click **Deploy**.

---

*Built for high-speed crypto markets analytics and institutional portfolio administration.*
