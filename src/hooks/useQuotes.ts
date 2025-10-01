import { useQuery } from '@tanstack/react-query';
import { quotesService, type QuoteCategory } from '../services/api/quotes';

// 📚 Hook options interface
interface UseQuotesOptions {
  category?: QuoteCategory;
  enabled?: boolean;
  refetchInterval?: number;
}

// 📚 Custom hook for quotes data with React Query
export function useQuotes({ 
  category = 'random',
  enabled = true,
  refetchInterval = 30 * 60 * 1000 // 30 minutes default
}: UseQuotesOptions = {}) {

  const {
    data: quote,
    isLoading,
    error,
    refetch,
    isRefetching,
    dataUpdatedAt,
  } = useQuery({
    // 📚 Unique query key for this quote category
    queryKey: ['quotes', category],
    
    // 📚 Function to fetch the data
    queryFn: () => quotesService.getRandomQuote(category),
    
    // 📚 Cache for 30 minutes
    staleTime: 30 * 60 * 1000,
    
    // 📚 Don't refetch on window focus for quotes
    refetchOnWindowFocus: false,
    
    // 📚 Enable/disable the query
    enabled,
    
    // 📚 Auto-refetch interval (optional)
    refetchInterval: refetchInterval > 0 ? refetchInterval : false,
    
    // 📚 Retry once on failure
    retry: 1,
    
    // 📚 Retry delay
    retryDelay: 2000,
  });

  // 📚 Get formatted last updated time
  const getLastUpdated = (): string => {
    if (!dataUpdatedAt) return 'Never';
    
    const now = Date.now();
    const diffMs = now - dataUpdatedAt;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return 'Over a day ago';
  };

  // 📚 Check if data is stale (older than 30 minutes)
  const isStale = (): boolean => {
    if (!dataUpdatedAt) return true;
    const now = Date.now();
    const diffMs = now - dataUpdatedAt;
    return diffMs > 30 * 60 * 1000; // 30 minutes
  };

  // 📚 Manual refresh function
  const refresh = () => {
    refetch();
  };

  return {
    quote,
    isLoading: isLoading || isRefetching,
    error,
    refresh,
    lastUpdated: getLastUpdated(),
    isStale: isStale(),
  };
}

// 📚 Hook for Quote of the Day (separate caching strategy)
export function useQuoteOfTheDay() {
  const {
    data: quote,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['quote-of-the-day', new Date().toDateString()],
    queryFn: () => quotesService.getQuoteOfTheDay(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 2000,
  });

  const refresh = () => {
    // Clear localStorage cache and refetch
    const today = new Date().toDateString();
    localStorage.removeItem(`quote-of-day-${today}`);
    refetch();
  };

  return {
    quote,
    isLoading: isLoading || isRefetching,
    error,
    refresh,
  };
}

// 📚 Hook for multiple quotes at once
export function useMultipleQuotes(count: number = 3, category: QuoteCategory = 'random') {
  const {
    data: quotes,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['quotes', 'multiple', category, count],
    queryFn: () => quotesService.getQuotes(count, category),
    staleTime: 15 * 60 * 1000, // 15 minutes for multiple quotes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 2000,
  });

  const refresh = () => {
    refetch();
  };

  return {
    quotes: quotes || [],
    isLoading: isLoading || isRefetching,
    error,
    refresh,
  };
}