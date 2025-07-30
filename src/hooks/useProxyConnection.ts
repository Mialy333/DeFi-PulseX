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