import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { newsService } from '../services/api/news';
import type { NewsArticle, NewsFilters, NewsCategory } from '../services/api/news';

// 📚 Hook options interface
export interface UseNewsOptions {
  category?: NewsCategory;
  country?: string;
  searchQuery?: string;
  pageSize?: number;
  enabled?: boolean; // Allow disabling the query
}

// 📚 Hook return interface
export interface UseNewsReturn {
  articles: NewsArticle[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  lastUpdated: string;
  isStale: boolean;
  totalArticles: number;
}

// 📚 Custom hook for news data with React Query
export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
  const {
    category = 'technology',
    country = 'us', 
    searchQuery,
    pageSize = 10,
    enabled = true
  } = options;

  // 📚 Create unique query key based on filters
  const queryKey = ['news', category, country, searchQuery, pageSize];

  // 📚 React Query for news data
  const {
    data: articles,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
    isStale
  }: UseQueryResult<NewsArticle[], Error> = useQuery({
    queryKey,
    queryFn: async () => {
      const filters: NewsFilters = {
        category,
        country,
        pageSize,
        ...(searchQuery && { q: searchQuery })
      };

      return newsService.getTopHeadlines(filters);
    },
    enabled, // Allow disabling the query
    staleTime: 1000 * 60 * 15, // 15 minutes (news updates less frequently than weather)
    refetchOnWindowFocus: true,
    refetchOnMount: false, // Don't refetch if we have recent data
    retry: (failureCount, error) => {
      // Don't retry on API key or quota errors
      if (error.message.includes('Invalid NewsAPI key') || 
          error.message.includes('rate limit exceeded') ||
          error.message.includes('upgrade required')) {
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
    articles,
    isLoading,
    error: error || null,
    refresh,
    lastUpdated: getLastUpdated(),
    isStale,
    totalArticles: articles?.length || 0
  };
}

// 📚 Hook for searching news (for future search functionality)
export function useNewsSearch(query: string, enabled: boolean = false): UseNewsReturn {
  const queryKey = ['news-search', query];

  const {
    data: articles,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
    isStale
  }: UseQueryResult<NewsArticle[], Error> = useQuery({
    queryKey,
    queryFn: () => newsService.searchEverything(query),
    enabled: enabled && query.length >= 3, // Only search if query is at least 3 characters
    staleTime: 1000 * 60 * 10, // 10 minutes for search results
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
    articles,
    isLoading,
    error: error || null,
    refresh: () => refetch(),
    lastUpdated: getLastUpdated(),
    isStale,
    totalArticles: articles?.length || 0
  };
}