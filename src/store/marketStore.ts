// store/marketStore.ts - Gestion des données de marché temps réel
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { MarketData, ChartData, ArbitrageOpportunity } from '../types/api';

interface MarketState {
  // Données de marché en temps réel - Le cœur du terminal
  marketData: Record<string, MarketData>; // Key: token address
  chartData: Record<string, ChartData[]>; // Key: pair (ex: "ETH-USDC")
  
  // Opportunités d'arbitrage - Fonctionnalité avancée
  arbitrageOpportunities: ArbitrageOpportunity[];
  
  // État de la connexion aux APIs
  isConnected: boolean;
  lastUpdate: number;
  error: string | null;
  
  // Actions pour mettre à jour les données
  updateMarketData: (tokenAddress: string, data: MarketData) => void;
  updateChartData: (pair: string, data: ChartData[]) => void;
  setArbitrageOpportunities: (opportunities: ArbitrageOpportunity[]) => void;
  setConnectionStatus: (connected: boolean) => void;
  setError: (error: string | null) => void;
}

// Store principal pour les données de marché
export const useMarketStore = create<MarketState>()(
  subscribeWithSelector((set, get) => ({
    // État initial - Vide au démarrage
    marketData: {},
    chartData: {},
    arbitrageOpportunities: [],
    isConnected: false,
    lastUpdate: 0,
    error: null,

    // Mise à jour des données de marché individuelles
    updateMarketData: (tokenAddress, data) => set((state) => ({
      marketData: {
        ...state.marketData,
        [tokenAddress]: data
      },
      lastUpdate: Date.now()
    })),

    // Mise à jour des données de graphiques
    updateChartData: (pair, data) => set((state) => ({
      chartData: {
        ...state.chartData,
        [pair]: data
      },
      lastUpdate: Date.now()
    })),

    // Mise à jour des opportunités d'arbitrage
    setArbitrageOpportunities: (opportunities) => set({
      arbitrageOpportunities: opportunities,
      lastUpdate: Date.now()
    }),

    // Gestion de la connexion
    setConnectionStatus: (connected) => set({ isConnected: connected }),
    setError: (error) => set({ error })
  }))
);

// store/portfolioStore.ts - Gestion du portefeuille utilisateur
import type { Portfolio, TokenBalance } from '../types/api';

interface PortfolioState {
  // Données du portefeuille - Central pour l'expérience utilisateur
  portfolio: Portfolio | null;
  selectedWallet: string | null;
  
  // Calculs dérivés - Optimisés pour l'affichage
  totalValueUSD: string;
  totalPnL24h: string;
  topTokensByValue: TokenBalance[];
  
  // État de chargement
  isLoading: boolean;
  lastRefresh: number;
  
  // Actions
  setPortfolio: (portfolio: Portfolio) => void;
  setSelectedWallet: (wallet: string) => void;
  refreshPortfolio: () => Promise<void>;
  calculateDerivedData: () => void;
}

export const usePortfolioStore = create<PortfolioState>()((set, get) => ({
  // État initial
  portfolio: null,
  selectedWallet: null,
  totalValueUSD: '0',
  totalPnL24h: '0',
  topTokensByValue: [],
  isLoading: false,
  lastRefresh: 0,

  // Définir le portefeuille et calculer les métriques dérivées
  setPortfolio: (portfolio) => {
    set({ portfolio, lastRefresh: Date.now() });
    get().calculateDerivedData();
  },

  setSelectedWallet: (wallet) => set({ selectedWallet: wallet }),

  // Rafraîchir les données du portefeuille via l'API 1inch
  refreshPortfolio: async () => {
    const { selectedWallet } = get();
    if (!selectedWallet) return;

    set({ isLoading: true });
    try {
      // Ici, nous appellerons l'API Portfolio de 1inch
      // const portfolio = await portfolioApi.getPortfolio(selectedWallet);
      // get().setPortfolio(portfolio);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du portefeuille:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Calculs dérivés pour optimiser l'affichage
  calculateDerivedData: () => {
    const { portfolio } = get();
    if (!portfolio) return;

    // Calculer la valeur totale et le P&L 24h
    let totalPnL = 0;
    const allTokens: TokenBalance[] = [];

    portfolio.chains.forEach(chain => {
      chain.tokens.forEach(token => {
        allTokens.push(token);
        const tokenValueUSD = parseFloat(token.balanceUSD);
        totalPnL += tokenValueUSD * (token.change24h / 100);
      });
    });

    // Top tokens par valeur (pour l'affichage prioritaire)
    const topTokens = allTokens
      .sort((a, b) => parseFloat(b.balanceUSD) - parseFloat(a.balanceUSD))
      .slice(0, 10);

    set({
      totalValueUSD: portfolio.totalValueUSD,
      totalPnL24h: totalPnL.toFixed(2),
      topTokensByValue: topTokens
    });
  }
}));

// store/tradingStore.ts - Gestion des trades actifs et de l'historique
interface TradingState {
  // Trades en cours - Critical pour le suivi temps réel
  activeTrades: ActiveTrade[];
  tradeHistory: ActiveTrade[];
  
  // Swaps cross-chain spéciaux (Fusion+)
  crossChainSwaps: XRPAtomicSwap[];
  
  // Configuration de trading
  slippage: number;
  gasPrice: 'slow' | 'standard' | 'fast';
  
  // État de l'interface
  isSwapping: boolean;
  selectedFromToken: string | null;
  selectedToToken: string | null;
  
  // Actions pour gérer les trades
  addActiveTrade: (trade: ActiveTrade) => void;
  updateTradeStatus: (tradeId: string, status: ActiveTrade['status']) => void;
  completeTrade: (tradeId: string, actualAmount: string, txHash: string) => void;
  
  // Actions pour les swaps cross-chain
  initiateCrossChainSwap: (swap: XRPAtomicSwap) => void;
  updateSwapStatus: (swapId: string, status: XRPAtomicSwap['status']) => void;
  
  // Configuration
  setSlippage: (slippage: number) => void;
  setGasPrice: (gasPrice: 'slow' | 'standard' | 'fast') => void;
}

export const useTradingStore = create<TradingState>()((set, get) => ({
  // État initial
  activeTrades: [],
  tradeHistory: [],
  crossChainSwaps: [],
  slippage: 0.5, // 0.5% par défaut
  gasPrice: 'standard',
  isSwapping: false,
  selectedFromToken: null,
  selectedToToken: null,

  // Ajouter un trade actif
  addActiveTrade: (trade) => set((state) => ({
    activeTrades: [...state.activeTrades, trade]
  })),

  // Mettre à jour le statut d'un trade
  updateTradeStatus: (tradeId, status) => set((state) => ({
    activeTrades: state.activeTrades.map(trade =>
      trade.id === tradeId ? { ...trade, status } : trade
    )
  })),

  // Compléter un trade (le déplacer vers l'historique)
  completeTrade: (tradeId, actualAmount, txHash) => set((state) => {
    const trade = state.activeTrades.find(t => t.id === tradeId);
    if (!trade) return state;

    const completedTrade: ActiveTrade = {
      ...trade,
      status: 'completed',
      actualAmount,
      txHash,
      completedAt: Date.now()
    };

    return {
      activeTrades: state.activeTrades.filter(t => t.id !== tradeId),
      tradeHistory: [completedTrade, ...state.tradeHistory]
    };
  }),

  // Gestion des swaps cross-chain (pour le prix XRP)
  initiateCrossChainSwap: (swap) => set((state) => ({
    crossChainSwaps: [...state.crossChainSwaps, swap]
  })),

  updateSwapStatus: (swapId, status) => set((state) => ({
    crossChainSwaps: state.crossChainSwaps.map(swap =>
      swap.swapId === swapId ? { ...swap, status } : swap
    )
  })),

  // Configuration
  setSlippage: (slippage) => set({ slippage }),
  setGasPrice: (gasPrice) => set({ gasPrice })
}));

// store/userStore.ts - Gestion du profil utilisateur et gamification
interface UserState {
  // Profil utilisateur complet
  profile: UserProfile | null;
  isLoggedIn: boolean;
  
  // Calculs temps réel pour la gamification
  xpToNextLevel: number;
  dailyXPEarned: number;
  canEarnDailyXP: boolean;
  
  // NFTs disponibles à minter
  availableNFTs: NFTReward[];
  
  // Actions utilisateur
  setProfile: (profile: UserProfile) => void;
  addXP: (amount: number, reason: string) => void;
  markDailyActivity: (activity: keyof UserProfile['todayActivities']) => void;
  claimNFT: (nftId: string) => void;
  
  // Calculs dérivés
  calculateXPMetrics: () => void;
  checkAvailableNFTs: () => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  // État initial
  profile: null,
  isLoggedIn: false,
  xpToNextLevel: 100,
  dailyXPEarned: 0,
  canEarnDailyXP: true,
  availableNFTs: [],

  // Définir le profil utilisateur
  setProfile: (profile) => {
    set({ profile, isLoggedIn: true });
    get().calculateXPMetrics();
    get().checkAvailableNFTs();
  },

  // Ajouter de l'XP avec raison (pour les notifications)
  addXP: (amount, reason) => {
    const { profile } = get();
    if (!profile) return;

    const newTotalXP = profile.totalXP + amount;
    const newLevel = Math.floor(newTotalXP / 100) + 1;

    set({
      profile: {
        ...profile,
        totalXP: newTotalXP,
        level: newLevel
      },
      dailyXPEarned: get().dailyXPEarned + amount
    });

    // Recalculer les métriques et vérifier les nouveaux NFTs
    get().calculateXPMetrics();
    get().checkAvailableNFTs();

    // Ici, nous pourrions ajouter une notification
    console.log(`+${amount} XP: ${reason}`);
  },

  // Marquer une activité quotidienne comme complétée
  markDailyActivity: (activity) => {
    const { profile } = get();
    if (!profile || profile.todayActivities[activity]) return;

    // Récompenses XP par activité
    const xpRewards = {
      platformUsed: 20,
      commentPosted: 20,
      tradeExecuted: 10
    };

    set({
      profile: {
        ...profile,
        todayActivities: {
          ...profile.todayActivities,
          [activity]: true
        }
      }
    });

    // Ajouter l'XP correspondant
    get().addXP(xpRewards[activity], `Activité quotidienne: ${activity}`);
  },

  // Réclamer un NFT
  claimNFT: (nftId) => {
    const { profile, availableNFTs } = get();
    if (!profile) return;

    const nft = availableNFTs.find(n => n.id === nftId);
    if (!nft) return;

    set({
      profile: {
        ...profile,
        nftsOwned: [...profile.nftsOwned, { ...nft, unlockedAt: Date.now() }]
      },
      availableNFTs: availableNFTs.filter(n => n.id !== nftId)
    });
  },

  // Calculer les métriques XP
  calculateXPMetrics: () => {
    const { profile } = get();
    if (!profile) return;

    const currentLevelXP = (profile.level - 1) * 100;
    const xpInCurrentLevel = profile.totalXP - currentLevelXP;
    const xpToNextLevel = 100 - xpInCurrentLevel;

    set({ xpToNextLevel });
  },

  // Vérifier quels NFTs sont disponibles à réclamer
  checkAvailableNFTs: () => {
    const { profile } = get();
    if (!profile) return;

    // NFTs disponibles basés sur l'XP total
    const possibleNFTs: NFTReward[] = [
      {
        id: 'starter',
        name: 'DeFi Starter',
        description: 'Bienvenue dans le monde DeFi !',
        rarity: 'common',
        requiredXP: 100,
        unlockedAt: 0,
        imageUrl: '/nfts/starter.png',
        metadata: { traits: [{ trait_type: 'Type', value: 'Starter' }] }
      },
      {
        id: 'trader',
        name: 'Cross-Chain Trader',
        description: 'Maître des swaps cross-chain',
        rarity: 'rare',
        requiredXP: 300,
        unlockedAt: 0,
        imageUrl: '/nfts/trader.png',
        metadata: { traits: [{ trait_type: 'Type', value: 'Trader' }] }
      },
      {
        id: 'master',
        name: 'DeFi Master',
        description: 'Expertise complète en DeFi',
        rarity: 'epic',
        requiredXP: 500,
        unlockedAt: 0,
        imageUrl: '/nfts/master.png',
        metadata: { traits: [{ trait_type: 'Type', value: 'Master' }] }
      }
    ];

    // Filtrer les NFTs disponibles (assez d'XP, pas déjà possédés)
    const availableNFTs = possibleNFTs.filter(nft => 
      profile.totalXP >= nft.requiredXP && 
      !profile.nftsOwned.some(owned => owned.id === nft.id)
    );

    set({ availableNFTs });
  }
}));