import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
// ...existing code (if any)

// Ajoutez ce hook si non présent
import { useState, useEffect } from 'react';

export function useProxyConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulez une connexion API (remplacez par votre logique réelle)
    const timer = setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { isConnected, isLoading, error };
}

class OneInchClient {
  private client: AxiosInstance;
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // Utiliser le proxy Vercel pour contourner CORS (comme mentionné dans la doc)
    this.baseURL = '/api/1inch-proxy'; // Pointe vers notre proxy Vercel
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 secondes timeout - Important pour les APIs temps réel
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // L'autorisation sera ajoutée par le proxy
      }
    });

    // Intercepteur pour ajouter l'API key et gérer les erreurs
    this.client.interceptors.request.use((config) => {
      // Le proxy Vercel ajoutera l'API key
      config.headers['X-API-Key'] = this.apiKey;
      return config;
    });

    // Intercepteur pour gérer les erreurs de manière unifiée
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Erreur API 1inch:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  // Méthode générique pour faire des requêtes
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }
}

// Instance singleton du client
let clientInstance: OneInchClient | null = null;

export const getOneInchClient = (apiKey: string): OneInchClient => {
  if (!clientInstance) {
    clientInstance = new OneInchClient(apiKey);
  }
  return clientInstance;
};