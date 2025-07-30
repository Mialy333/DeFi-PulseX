// ========================================
// MARKET DATA - Types for price and trading data
// ========================================

export interface MarketData {
  price: number;
  volume24h: number;
  change24h: number;
  high24h: number;
  low24h: number;
  marketCap: number;
  lastUpdated: number;
  address: string;
  symbol: string;
  priceChange24h: number;
  liquidity: number;
}

export interface SimpleChartData {
  timestamp: number;
  price: number;
  volume: number;
}

export interface QuoteResponse {
  fromToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  toToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  toTokenAmount: string;
  estimatedGas: number;
  protocols: Array<{
    name: string;
    part: number;
    fromTokenAddress: string;
    toTokenAddress: string;
  }>;
}

export interface TokenList {
  tokens: {
    [address: string]: {
      symbol: string;
      name: string;
      decimals: number;
      address: string;
      logoURI?: string;
    };
  };
}

// ========================================
// PORTFOLIO - Types for user holdings
// ========================================

export interface Portfolio {
  wallet: string;
  chains: Array<{
    chainId: number;
    name: string;
    totalValueUSD: string;
    tokens: TokenBalance[];
  }>;
  totalValueUSD: string;
  lastUpdated: number;
}

export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceUSD: string;
  price: number;
  change24h: number;
  logoURI?: string;
}

// ========================================
// CHART DATA - Types for price charts
// ========================================

export interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartResponse {
  pair: string;
  timeframe: string;
  data: ChartData[];
}

// ========================================
// XRP LEDGER - Types for atomic swaps
// ========================================

export interface XRPAtomicSwap {
  swapId: string;
  sourceChain: 'ethereum' | 'xrp';
  destinationChain: 'ethereum' | 'xrp';
  fromAmount: string;
  toAmount: string;
  fromToken: string;
  toToken: string;
  secretHash: string;
  secret?: string;
  timelock: number;
  makerAddress: string;
  takerAddress: string;
  status: 'pending' | 'locked' | 'completed' | 'expired' | 'cancelled';
  createdAt: number;
  completedAt?: number;
  sourceTxHash?: string;
  destinationTxHash?: string;
}

// ========================================
// GAMIFICATION - Types for user engagement
// ========================================

export interface UserProfile {
  walletAddress: string;
  username?: string;
  totalXP: number;
  level: number;
  dailyStreak: number;
  lastActiveDate: string;
  todayActivities: {
    platformUsed: boolean;
    commentPosted: boolean;
    tradeExecuted: boolean;
  };
  nftsOwned: NFTReward[];
  totalTrades: number;
  totalVolumeUSD: string;
  communityContributions: number;
  badges: UserBadge[];
}

export interface NFTReward {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: number;
  requiredXP: number;
  imageUrl: string;
  metadata: {
    traits: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: number;
  category: 'trading' | 'community' | 'analytics' | 'cross-chain';
}

// ========================================
// TRADING - Types for trading logic
// ========================================

export interface ActiveTrade {
  id: string;
  type: 'classic' | 'fusion' | 'fusion_plus' | 'orderbook';
  fromToken: string;
  toToken: string;
  fromAmount: string;
  expectedAmount: string;
  actualAmount?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
  crossChainDetails?: {
    sourceChain: string;
    destinationChain: string;
    atomicSwapId?: string;
  };
  txHash?: string;
  explorerUrl?: string;
  estimatedGas: string;
  gasPrice: string;
  networkFee: string;
}

export interface ArbitrageOpportunity {
  id: string;
  tokenSymbol: string;
  prices: Array<{
    chain: string;
    dex: string;
    price: number;
    liquidity: string;
  }>;
  bestBuyPrice: number;
  bestSellPrice: number;
  profitPercentage: number;
  profitUSD: string;
  minTradeSize: string;
  maxTradeSize: string;
  estimatedGasCost: string;
  netProfitUSD: string;
  discoveredAt: number;
  validUntil: number;
}

// ========================================
// UI STATE - Types for interface state
// ========================================

export interface DashboardState {
  selectedTimeframe: '1h' | '4h' | '1d' | '7d' | '30d';
  selectedChains: string[];
  activeView: 'portfolio' | 'trading' | 'analytics' | 'community';
  isConnected: boolean;
  lastDataUpdate: number;
  activeAlerts: Alert[];
  notifications: Notification[];
}

export interface Alert {
  id: string;
  type: 'price' | 'volume' | 'arbitrage' | 'trade_status';
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: number;
  acknowledged: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
  read: boolean;
}
