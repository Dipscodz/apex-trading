import { CryptoMarketData, PricePoint } from '@/types';

export const INITIAL_CRYPTO_DATA: CryptoMarketData[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 64280.50,
    market_cap: 1265000000000,
    market_cap_rank: 1,
    total_volume: 28450000000,
    high_24h: 65100.00,
    low_24h: 63800.00,
    price_change_24h: 840.50,
    price_change_percentage_24h: 1.32,
    circulating_supply: 19750000,
    sparkline_in_7d: {
      price: [62100, 62800, 63400, 63100, 63900, 64100, 64280]
    }
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3480.20,
    market_cap: 418000000000,
    market_cap_rank: 2,
    total_volume: 16200000000,
    high_24h: 3540.00,
    low_24h: 3410.00,
    price_change_24h: 52.80,
    price_change_percentage_24h: 1.54,
    circulating_supply: 120200000,
    sparkline_in_7d: {
      price: [3350, 3390, 3420, 3400, 3450, 3470, 3480]
    }
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 154.80,
    market_cap: 72100000000,
    market_cap_rank: 3,
    total_volume: 4100000000,
    high_24h: 159.20,
    low_24h: 149.50,
    price_change_24h: 4.10,
    price_change_percentage_24h: 2.72,
    circulating_supply: 466000000,
    sparkline_in_7d: {
      price: [142, 145, 148, 146, 151, 153, 154.8]
    }
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 578.40,
    market_cap: 84500000000,
    market_cap_rank: 4,
    total_volume: 1100000000,
    high_24h: 585.00,
    low_24h: 571.20,
    price_change_24h: -3.20,
    price_change_percentage_24h: -0.55,
    circulating_supply: 146000000,
    sparkline_in_7d: {
      price: [588, 584, 580, 582, 579, 581, 578.4]
    }
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    current_price: 0.5840,
    market_cap: 32800000000,
    market_cap_rank: 5,
    total_volume: 1450000000,
    high_24h: 0.6020,
    low_24h: 0.5720,
    price_change_24h: 0.0115,
    price_change_percentage_24h: 2.01,
    circulating_supply: 56200000000,
    sparkline_in_7d: {
      price: [0.55, 0.56, 0.57, 0.565, 0.575, 0.58, 0.584]
    }
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.3850,
    market_cap: 13800000000,
    market_cap_rank: 6,
    total_volume: 380000000,
    high_24h: 0.3950,
    low_24h: 0.3740,
    price_change_24h: 0.008,
    price_change_percentage_24h: 2.12,
    circulating_supply: 35800000000,
    sparkline_in_7d: {
      price: [0.36, 0.365, 0.37, 0.375, 0.38, 0.382, 0.385]
    }
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    current_price: 0.1240,
    market_cap: 18100000000,
    market_cap_rank: 7,
    total_volume: 980000000,
    high_24h: 0.1290,
    low_24h: 0.1180,
    price_change_24h: 0.0045,
    price_change_percentage_24h: 3.77,
    circulating_supply: 145000000000,
    sparkline_in_7d: {
      price: [0.112, 0.115, 0.118, 0.119, 0.121, 0.123, 0.124]
    }
  },
  {
    id: 'avalanche-2',
    symbol: 'AVAX',
    name: 'Avalanche',
    image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    current_price: 24.60,
    market_cap: 9800000000,
    market_cap_rank: 8,
    total_volume: 340000000,
    high_24h: 25.40,
    low_24h: 23.90,
    price_change_24h: 0.40,
    price_change_percentage_24h: 1.65,
    circulating_supply: 395000000,
    sparkline_in_7d: {
      price: [23.1, 23.4, 23.8, 24.0, 24.2, 24.5, 24.6]
    }
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    current_price: 11.45,
    market_cap: 6900000000,
    market_cap_rank: 9,
    total_volume: 210000000,
    high_24h: 11.80,
    low_24h: 11.10,
    price_change_24h: 0.25,
    price_change_percentage_24h: 2.23,
    circulating_supply: 608000000,
    sparkline_in_7d: {
      price: [10.8, 11.0, 11.1, 11.2, 11.3, 11.4, 11.45]
    }
  },
  {
    id: 'sui',
    symbol: 'SUI',
    name: 'Sui',
    image: 'https://assets.coingecko.com/coins/images/26375/large/sui-ocean-square.png',
    current_price: 1.62,
    market_cap: 4500000000,
    market_cap_rank: 10,
    total_volume: 540000000,
    high_24h: 1.71,
    low_24h: 1.52,
    price_change_24h: 0.09,
    price_change_percentage_24h: 5.88,
    circulating_supply: 2750000000,
    sparkline_in_7d: {
      price: [1.38, 1.42, 1.48, 1.51, 1.55, 1.59, 1.62]
    }
  },
  {
    id: 'near',
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    image: 'https://assets.coingecko.com/coins/images/10365/large/near.png',
    current_price: 4.35,
    market_cap: 4800000000,
    market_cap_rank: 11,
    total_volume: 290000000,
    high_24h: 4.52,
    low_24h: 4.18,
    price_change_24h: 0.12,
    price_change_percentage_24h: 2.84,
    circulating_supply: 1100000000,
    sparkline_in_7d: {
      price: [4.05, 4.12, 4.20, 4.22, 4.28, 4.31, 4.35]
    }
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    current_price: 4.65,
    market_cap: 6700000000,
    market_cap_rank: 12,
    total_volume: 180000000,
    high_24h: 4.80,
    low_24h: 4.50,
    price_change_24h: -0.05,
    price_change_percentage_24h: -1.06,
    circulating_supply: 1440000000,
    sparkline_in_7d: {
      price: [4.82, 4.75, 4.71, 4.68, 4.66, 4.67, 4.65]
    }
  }
];

export async function fetchLiveCryptoMarkets(): Promise<CryptoMarketData[]> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v1/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=true&price_change_percentage=24h',
      { next: { revalidate: 30 } }
    );
    if (!res.ok) throw new Error('Failed to fetch from CoinGecko');
    const data: CryptoMarketData[] = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // Fall back gracefully to initialized live dataset
  }
  return INITIAL_CRYPTO_DATA;
}

export function generateHistoricalChartData(basePrice: number, timeframe: '1H' | '24H' | '7D' | '1M' | '1Y'): PricePoint[] {
  const points: PricePoint[] = [];
  let count = 24;
  let intervalMs = 3600 * 1000; // 1 hour

  if (timeframe === '1H') {
    count = 30;
    intervalMs = 2 * 60 * 1000; // 2 min
  } else if (timeframe === '24H') {
    count = 24;
    intervalMs = 3600 * 1000; // 1 hour
  } else if (timeframe === '7D') {
    count = 28;
    intervalMs = 6 * 3600 * 1000; // 6 hours
  } else if (timeframe === '1M') {
    count = 30;
    intervalMs = 24 * 3600 * 1000; // 1 day
  } else if (timeframe === '1Y') {
    count = 52;
    intervalMs = 7 * 24 * 3600 * 1000; // 1 week
  }

  const now = Date.now();
  let currentPrice = basePrice * (1 - (Math.random() * 0.08 - 0.04));

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now - i * intervalMs);
    const fluctuation = (Math.random() - 0.49) * 0.02; // -1% to +1%
    currentPrice = Math.max(0.0001, currentPrice * (1 + fluctuation));
    const open = currentPrice * (1 - (Math.random() * 0.005 - 0.0025));
    const high = Math.max(open, currentPrice) * (1 + Math.random() * 0.006);
    const low = Math.min(open, currentPrice) * (1 - Math.random() * 0.006);
    const volume = Math.floor(basePrice * 1500 * (0.8 + Math.random() * 0.5));

    points.push({
      timestamp: timeframe === '1H' || timeframe === '24H'
        ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      price: Number(currentPrice.toFixed(basePrice < 1 ? 4 : 2)),
      open: Number(open.toFixed(basePrice < 1 ? 4 : 2)),
      high: Number(high.toFixed(basePrice < 1 ? 4 : 2)),
      low: Number(low.toFixed(basePrice < 1 ? 4 : 2)),
      close: Number(currentPrice.toFixed(basePrice < 1 ? 4 : 2)),
      volume,
    });
  }

  // Ensure last point matches exact current base price
  if (points.length > 0) {
    points[points.length - 1].price = basePrice;
    points[points.length - 1].close = basePrice;
  }

  return points;
}
