import { useState, useCallback, useRef } from 'react';
import { useTradingStore } from '../store/tradingStore';
import { XRPLClient } from '../services/api/xrp/xrplClient';
import { AtomicSwapManager } from '../services/api/xrp/atomicSwap';
import { FusionPlusXRPIntegration } from '../services/api/xrp/fusionPlusXRP';
import { XRPAtomicSwap, ActiveTrade } from '../types/api';

export const useFusionPlusSwap = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [swapProgress, setSwapProgress] = useState<string>('');
  
  const xrplClientRef = useRef<XRPLClient | null>(null);
  const atomicSwapManagerRef = useRef<AtomicSwapManager | null>(null);
  const fusionPlusIntegrationRef = useRef<FusionPlusXRPIntegration | null>(null);

  const {
    crossChainSwaps,
    activeTrades,
    initiateCrossChainSwap,
    updateSwapStatus,
    addActiveTrade
  } = useTradingStore();

  // Initialiser les clients pour les swaps cross-chain
  const initializeSwapClients = useCallback(async () => {
    if (xrplClientRef.current) return true;

    setIsInitializing(true);
    setSwapProgress('Connexion au XRP Ledger...');

    try {
      // Initialiser le client XRP
      xrplClientRef.current = new XRPLClient();
      const connected = await xrplClientRef.current.connect();
      
      if (!connected) {
        throw new Error('Impossible de se connecter au XRP Ledger');
      }

      setSwapProgress('Initialisation du gestionnaire atomic swap...');
      
      // Initialiser le gestionnaire d'atomic swaps
      const ethereumRpcUrl = process.env.REACT_APP_ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID';
      atomicSwapManagerRef.current = new AtomicSwapManager(
        xrplClientRef.current,
        ethereumRpcUrl
      );

      setSwapProgress('Configuration Fusion+ XRP...');
      
      // Initialiser l'intégration Fusion+
      fusionPlusIntegrationRef.current = new FusionPlusXRPIntegration(
        atomicSwapManagerRef.current,
        xrplClientRef.current
      );

      setSwapProgress('Prêt pour les swaps cross-chain !');
      return true;

    } catch (error) {
      console.error('Erreur lors de l\'initialisation des clients swap:', error);
      setSwapProgress(`Erreur: ${error.message}`);
      return false;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Initier un swap ETH → XRP
  const swapETHtoXRP = useCallback(async (
    ethAmount: string,
    xrpAmount: string,
    xrpDestination: string
  ): Promise<{ success: boolean; swapId?: string; error?: string }> => {
    try {
      const initialized = await initializeSwapClients();
      if (!initialized) {
        return { success: false, error: 'Échec de l\'initialisation' };
      }

      setSwapProgress('Création de l\'ordre Fusion+ XRP...');

      const result = await fusionPlusIntegrationRef.current!.createFusionPlusXRPOrder(
        'ETH_to_XRP',
        ethAmount,
        xrpAmount,
        xrpDestination
      );

      // Ajouter le swap aux stores
      initiateCrossChainSwap(result.atomicSwap);
      
      const trade: ActiveTrade = {
        id: result.atomicSwap.swapId,
        type: 'fusion_plus',
        fromToken: 'ETH',
        toToken: 'XRP',
        fromAmount: ethAmount,
        expectedAmount: xrpAmount,
        status: 'processing',
        createdAt: Date.now(),
        crossChainDetails: {
          sourceChain: 'ethereum',
          destinationChain: 'xrp',
          atomicSwapId: result.atomicSwap.swapId
        },
        estimatedGas: '50000', // Estimation
        gasPrice: '20000000000', // 20 gwei
        networkFee: '0.001' // 0.001 ETH
      };
      
      addActiveTrade(trade);

      // Commencer la surveillance
      fusionPlusIntegrationRef.current!.monitorAndCompleteOrder(
        result.orderId,
        result.atomicSwap
      );

      setSwapProgress('Swap initié avec succès !');
      
      return {
        success: true,
        swapId: result.atomicSwap.swapId
      };

    } catch (error) {
      console.error('Erreur lors du swap ETH→XRP:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }, [initializeSwapClients, initiateCrossChainSwap, addActiveTrade]);

  // Initier un swap XRP → ETH
  const swapXRPtoETH = useCallback(async (
    xrpAmount: string,
    ethAmount: string,
    ethDestination: string
  ): Promise<{ success: boolean; swapId?: string; error?: string }> => {
    try {
      const initialized = await initializeSwapClients();
      if (!initialized) {
        return { success: false, error: 'Échec de l\'initialisation' };
      }

      setSwapProgress('Création de l\'ordre Fusion+ XRP→ETH...');

      const result = await fusionPlusIntegrationRef.current!.createFusionPlusXRPOrder(
        'XRP_to_ETH',
        xrpAmount,
        ethAmount,
        ethDestination
      );

      initiateCrossChainSwap(result.atomicSwap);
      
      const trade: ActiveTrade = {
        id: result.atomicSwap.swapId,
        type: 'fusion_plus',
        fromToken: 'XRP',
        toToken: 'ETH',
        fromAmount: xrpAmount,
        expectedAmount: ethAmount,
        status: 'processing',
        createdAt: Date.now(),
        crossChainDetails: {
          sourceChain: 'xrp',
          destinationChain: 'ethereum',
          atomicSwapId: result.atomicSwap.swapId
        },
        estimatedGas: '50000',
        gasPrice: '20000000000',
        networkFee: '0.001'
      };
      
      addActiveTrade(trade);

      fusionPlusIntegrationRef.current!.monitorAndCompleteOrder(
        result.orderId,
        result.atomicSwap
      );

      setSwapProgress('Swap XRP→ETH initié avec succès !');
      
      return {
        success: true,
        swapId: result.atomicSwap.swapId
      };

    } catch (error) {
      console.error('Erreur lors du swap XRP→ETH:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }, [initializeSwapClients, initiateCrossChainSwap, addActiveTrade]);

  // Récupérer le statut d'un swap
  const getSwapStatus = useCallback((swapId: string) => {
    return crossChainSwaps.find(swap => swap.swapId === swapId);
  }, [crossChainSwaps]);

  // Statistiques des swaps
  const swapStats = {
    totalSwaps: crossChainSwaps.length,
    completedSwaps: crossChainSwaps.filter(s => s.status === 'completed').length,
    activeSwaps: crossChainSwaps.filter(s => s.status === 'locked' || s.status === 'pending').length,
    failedSwaps: crossChainSwaps.filter(s => s.status === 'cancelled' || s.status === 'expired').length
  };

  return {
    // États
    isInitializing,
    swapProgress,
    crossChainSwaps,
    activeTrades: activeTrades.filter(t => t.type === 'fusion_plus'),
    swapStats,
    
    // Actions
    initializeSwapClients,
    swapETHtoXRP,
    swapXRPtoETH,
    getSwapStatus
  };
};