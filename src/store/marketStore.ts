import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { MarketData, ChartData, ArbitrageOpportunity } from '../types/api';

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