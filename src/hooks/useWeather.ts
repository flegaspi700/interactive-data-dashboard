import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/api/weather';
import type { Coordinates } from './useGeolocation';

// 📚 Hook options interface
interface UseWeatherOptions {
  city?: string;
  coordinates?: Coordinates;
  enabled?: boolean;
  refetchInterval?: number;
}

// 📚 Custom hook for weather data with React Query
export function useWeather(options: UseWeatherOptions = {}) {
  const { 
    city, 
    coordinates,
    enabled = true,
    refetchInterval = 5 * 60 * 1000 // 5 minutes default
  } = options;
  
  // 📚 Determine query key and function based on input type
  // Use coordinates if they exist, otherwise use city (default to Manila if no city provided)
  const useCoordinates = !!coordinates;
  const finalCity = city || 'Manila';
  
  const queryKey = useCoordinates 
    ? ['weather', 'coords', coordinates.latitude, coordinates.longitude]
    : ['weather', 'city', finalCity];
  
  const queryFn = useCoordinates
    ? () => weatherService.getCurrentWeatherByCoords(coordinates.latitude, coordinates.longitude)
    : () => weatherService.getCurrentWeather(finalCity);

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    dataUpdatedAt,
  } = useQuery({
    // 📚 Unique query key for this weather data
    queryKey,
    
    // 📚 Function to fetch the data
    queryFn,
    
    // 📚 Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
    
    // 📚 Refetch when window gains focus
    refetchOnWindowFocus: true,
    
    // 📚 Automatic background refetch
    refetchInterval: refetchInterval,
    
    // 📚 Only fetch if enabled and we have either coordinates or a city
    enabled: enabled && (useCoordinates ? !!coordinates : !!city),
    
    // 📚 Retry once on failure
    retry: 1,
    
    // 📚 Keep previous data while fetching new data
    placeholderData: (previousData) => previousData,
  });

  // 📚 Helper function to manually refresh data
  const refresh = () => {
    refetch();
  };

  // 📚 Get formatted last updated time
  const getLastUpdatedText = () => {
    if (!dataUpdatedAt) return 'Never';
    
    const now = new Date();
    const updated = new Date(dataUpdatedAt);
    const diffMs = now.getTime() - updated.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return updated.toLocaleDateString();
  };

  // 📚 Check if data is stale (older than 10 minutes)
  const isStale = () => {
    if (!dataUpdatedAt) return true;
    const now = new Date();
    const updated = new Date(dataUpdatedAt);
    const diffMs = now.getTime() - updated.getTime();
    return diffMs > 10 * 60 * 1000; // 10 minutes
  };

  return {
    // 📚 Weather data
    weather: data,
    
    // 📚 Loading states
    isLoading,
    isRefetching,
    
    // 📚 Error handling
    error: error as Error | null,
    
    // 📚 Actions
    refresh,
    
    // 📚 Metadata
    lastUpdated: getLastUpdatedText(),
    isStale: isStale(),
    city,
  };
}

// 📚 Hook for multiple cities (future use)
export function useMultipleWeather(cities: string[]) {
  const queries = cities.map(city => ({
    queryKey: ['weather', city],
    queryFn: () => weatherService.getCurrentWeather(city),
    staleTime: 5 * 60 * 1000,
    enabled: !!city,
  }));

  // Note: This would require useQueries from React Query
  // For now, we'll keep it simple with single city hook
  return { queries };
}