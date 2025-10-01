import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { githubService } from '../services/api/github';
import type { GitHubStats } from '../services/api/github';

// 📚 Hook options interface
export interface UseGitHubOptions {
  username: string;
  enabled?: boolean;
}

// 📚 Hook return interface
export interface UseGitHubReturn {
  stats: GitHubStats | undefined;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  lastUpdated: string;
  isStale: boolean;
  hasToken: boolean;
  rateLimit: string;
}

// 📚 Custom hook for GitHub data with React Query
export function useGitHub(options: UseGitHubOptions): UseGitHubReturn {
  const { username, enabled = true } = options;

  // 📚 Get API info
  const { hasToken, rateLimit } = githubService.getApiInfo();

  // 📚 Create query key
  const queryKey = ['github', username];

  // 📚 React Query for GitHub data
  const {
    data: stats,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
    isStale
  }: UseQueryResult<GitHubStats, Error> = useQuery({
    queryKey,
    queryFn: async () => {
      if (!username || username.trim() === '') {
        throw new Error('Username is required');
      }
      return githubService.getUserStats(username.trim());
    },
    enabled: enabled && !!username && username.trim() !== '',
    staleTime: 1000 * 60 * 10, // 10 minutes (GitHub data doesn't change frequently)
    refetchOnWindowFocus: false, // Don't refetch on window focus to save API calls
    refetchOnMount: false, // Don't refetch if we have recent data
    retry: (failureCount, error) => {
      // Don't retry on user not found, auth errors, or rate limit
      if (error.message.includes('not found') ||
          error.message.includes('authentication failed') ||
          error.message.includes('rate limit exceeded') ||
          error.message.includes('access forbidden')) {
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
    stats,
    isLoading,
    error: error || null,
    refresh,
    lastUpdated: getLastUpdated(),
    isStale,
    hasToken,
    rateLimit
  };
}

// 📚 Hook for rate limit monitoring (optional utility)
export function useGitHubRateLimit() {
  const queryKey = ['github-rate-limit'];

  const {
    data: rateLimit,
    isLoading,
    error
  } = useQuery({
    queryKey,
    queryFn: () => githubService.getRateLimit(),
    enabled: githubService.isTokenConfigured(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    retry: 1
  });

  return {
    rateLimit,
    isLoading,
    error: error || null
  };
}