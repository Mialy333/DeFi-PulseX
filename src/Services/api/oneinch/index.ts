// src/services/api/1inch/index.ts
import { SwapAPI } from './swapApi';
import { PortfolioAPI } from './portfolioApi';
import { MarketAPI } from './marketApi';

export class OneInchAPI {
  public swap: SwapAPI;
  public portfolio: PortfolioAPI;
  public market: MarketAPI;

  constructor(apiKey: string) {
    this.swap = new SwapAPI(apiKey);
    this.portfolio = new PortfolioAPI(apiKey);
    this.market = new MarketAPI(apiKey);
  }

  // Méthode pour tester la connectivité à toutes les APIs
  async testConnection(): Promise<boolean> {
    try {
      // Test simple sur chaque API
      await Promise.all([
        this.market.getSpotPrice('0xA0b86a33E6885D0c5906C0Ae01fAec12E7e9B85E'), // USDC
        this.market.getGasPrice(),
      ]);
      
      console.log('✅ Connexion aux APIs 1inch réussie');
      return true;
    } catch (error) {
      console.error('❌ Erreur de connexion aux APIs 1inch:', error);
      return false;
    }
  }
}

// Configuration par défaut pour l'export
export const createOneInchAPI = (apiKey: string) => new OneInchAPI(apiKey);

// Export all API classes
export { SwapAPI } from './swapApi';
export { PortfolioAPI } from './portfolioApi';
export { MarketAPI } from './marketApi';