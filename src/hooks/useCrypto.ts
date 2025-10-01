import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { cryptoService } from '../services/api/crypto';
import type { CryptoData } from '../services/api/crypto';

// 📚 Hook options interface
export interface UseCryptoOptions {
  limit?: number;
  enabled?: boolean;
}

// 📚 Hook return interface
export interface UseCryptoReturn {
  coins: CryptoData[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  lastUpdated: string;
  isStale: boolean;
  totalCoins: number;
}

// 📚 Custom hook for crypto data with React Query
export function useCrypto(options: UseCryptoOptions = {}): UseCryptoReturn {
  const { limit = 8, enabled = true } = options;

  // 📚 Create query key
  const queryKey = ['crypto', limit];

  // 📚 React Query for crypto data
  const {
    data: coins,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
    isStale
  }: UseQueryResult<CryptoData[], Error> = useQuery({
    queryKey,
    queryFn: () => cryptoService.getTopCoins(limit),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes (crypto prices change frequently)
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: false, // Don't refetch if we have recent data
    retry: (failureCount, error) => {
      // Don't retry on rate limit errors
      if (error.message.includes('rate limit') || 
          error.message.includes('429')) {
        return false;
      }
      return failureCount < 2; // Retry twice for network errors
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // 📚 Format last updated time
  const getLastUpdated = (): string => {
    if (!dataUpdatedAt) return 'never';
    
    const now = new Date();
    const updated = new Date(dataUpdatedAt);
    const diffInMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return updated.toLocaleDateString();
  };

  // 📚 Refresh function
  const refresh = () => {
    refetch();
  };

  return {
    coins,
    isLoading,
    error: error || null,
    refresh,
    lastUpdated: getLastUpdated(),
    isStale,
    totalCoins: coins?.length || 0
  };
}

// 📚 Hook for getting specific cryptocurrencies (future use)
export function useSpecificCrypto(coinIds: string[], enabled: boolean = true): UseCryptoReturn {
  const queryKey = ['crypto-specific', coinIds.sort().join(',')];

  const {
    data: coins,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
    isStale
  }: UseQueryResult<CryptoData[], Error> = useQuery({
    queryKey,
    queryFn: async () => {
      // For now, get top coins and filter by IDs
      // In a real app, you might have a specific endpoint for this
      const allCoins = await cryptoService.getTopCoins(50);
      return allCoins.filter(coin => coinIds.includes(coin.id));
    },
    enabled: enabled && coinIds.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1
  });

  const getLastUpdated = (): string => {
    if (!dataUpdatedAt) return 'never';
    const now = new Date();
    const updated = new Date(dataUpdatedAt);
    const diffInMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  };

  return {
    coins,
    isLoading,
    error: error || null,
    refresh: () => refetch(),
    lastUpdated: getLastUpdated(),
    isStale,
    totalCoins: coins?.length || 0
  };
}