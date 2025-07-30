import axios from 'axios';
import { MarketData, QuoteResponse, TokenList } from '../../../types/api';

const BASE_URL = 'https://api.1inch.dev/v5.0';

interface OneInchAPI {
  getQuote: (fromToken: string, toToken: string, amount: string) => Promise<QuoteResponse>;
  getTokenList: () => Promise<TokenList>;
  getMarketData: (tokenAddress: string) => Promise<MarketData>;
}

export const createOneInchAPI = (apiKey: string): OneInchAPI => {
  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    }
  });

  return {
    async getQuote(fromToken: string, toToken: string, amount: string) {
      try {
        const response = await client.get('/quote', {
          params: {
            fromTokenAddress: fromToken,
            toTokenAddress: toToken,
            amount
          }
        });
        return response.data;
      } catch (error) {
        console.error('1inch API error:', error);
        throw error;
      }
    },

    async getTokenList() {
      try {
        const response = await client.get('/tokens');
        return response.data;
      } catch (error) {
        console.error('1inch API error:', error);
        throw error;
      }
    },

    async getMarketData(tokenAddress: string): Promise<MarketData> {
      // Simulated market data for demo
      return {
        price: Math.random() * 2000,
        volume24h: Math.random() * 1000000,
        change24h: (Math.random() - 0.5) * 10,
        high24h: Math.random() * 2500,
        low24h: Math.random() * 1500,
        marketCap: Math.random() * 1000000000
      };
    }
  };
};
