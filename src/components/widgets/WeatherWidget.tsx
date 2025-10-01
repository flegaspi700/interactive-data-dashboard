import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, MapPin, Clock, Navigation } from 'lucide-react';
import { BaseWidget } from './BaseWidget';
import { useWeather } from '../../hooks/useWeather';
import { useGeolocation } from '../../hooks/useGeolocation';
import { weatherService } from '../../services/api/weather';

interface WeatherWidgetProps {
  initialCity?: string;
  className?: string;
}

export function WeatherWidget({ initialCity = 'Manila', className }: WeatherWidgetProps) {
  const [city, setCity] = useState(initialCity);
  const [inputCity, setInputCity] = useState(city);
  const [isEditing, setIsEditing] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false); // 📚 Default to city mode for faster loading
  const [currentTime, setCurrentTime] = useState(new Date());

  // 📚 Geolocation hook
  const { 
    coordinates, 
    isLoading: isGeoLoading, 
    error: geoError, 
    requestLocation,
    isSupported: isGeoSupported 
  } = useGeolocation();

  // 📚 Weather hook - use coordinates if available, otherwise use city
  const { 
    weather, 
    isLoading, 
    error, 
    refresh, 
    lastUpdated,
    isStale 
  } = useWeather({ 
    city: useCurrentLocation ? undefined : city,
    coordinates: useCurrentLocation && coordinates ? coordinates : undefined
  });

  // 📚 Auto-request current location on mount if geolocation is supported
  useEffect(() => {
    if (isGeoSupported && useCurrentLocation && !coordinates && !isGeoLoading && !geoError) {
      requestLocation();
    }
  }, [isGeoSupported, useCurrentLocation, coordinates, isGeoLoading, geoError, requestLocation]);

  // 📚 If geolocation fails, fallback to city mode
  useEffect(() => {
    if (geoError && useCurrentLocation) {
      setUseCurrentLocation(false);
    }
  }, [geoError, useCurrentLocation]);

  // 📚 Auto-enable location if supported (but start with city mode for fast loading)
  useEffect(() => {
    if (isGeoSupported) {
      // Enable location mode after a short delay to allow city weather to load first
      const timer = setTimeout(() => {
        setUseCurrentLocation(true);
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    }
  }, [isGeoSupported]);

  // 📚 Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 📚 Handle city search
  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setUseCurrentLocation(false); // Switch back to city mode
      setIsEditing(false);
    }
  };

  // 📚 Handle current location request
  const handleCurrentLocation = () => {
    setUseCurrentLocation(true);
    requestLocation();
    setIsEditing(false);
  };

  // 📚 Handle settings (city selection)
  const handleSettings = () => {
    setIsEditing(true);
    setInputCity(city);
  };

  // 📚 Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setInputCity(city);
  };

  // 📚 Get current location display
  const getLocationDisplay = () => {
    if (useCurrentLocation) {
      if (isGeoLoading) return 'Detecting location...';
      if (geoError) return 'Manual location';
      if (weather) return weather.location;
      return 'Current location';
    }
    return weather ? weather.location : city;
  };

  // 📚 Format current date and time
  const formatDateTime = (date: Date) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    
    return { date: formattedDate, time: formattedTime };
  };

  return (
    <BaseWidget
      widgetId="weather-widget"
      title="Weather"
      subtitle={getLocationDisplay()}
      size="large"
      isLoading={isLoading || isGeoLoading}
      error={error || geoError}
      onRefresh={refresh}
      onSettings={handleSettings}
      className={className}
    >
      <div className="h-full flex flex-col min-h-0">
        
        {/* 📚 Location Search Form (shown when editing) */}
        {isEditing && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex-shrink-0 max-h-48 overflow-y-auto">
            
            {/* Current Location Button */}
            {isGeoSupported && (
              <div className="mb-3">
                <button
                  onClick={handleCurrentLocation}
                  disabled={isGeoLoading}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    useCurrentLocation 
                      ? 'bg-green-500 hover:bg-green-600 disabled:bg-green-300'
                      : 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300'
                  } text-white`}
                >
                  <Navigation className="w-4 h-4" />
                  {isGeoLoading 
                    ? 'Getting location...' 
                    : useCurrentLocation 
                      ? 'Using Current Location ✓' 
                      : 'Use Current Location'
                  }
                </button>
                {geoError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {geoError} - Switched to manual city search.
                  </p>
                )}
              </div>
            )}

            {/* Divider */}
            {isGeoSupported && (
              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                <span className="px-2 text-xs text-gray-500 dark:text-gray-400">or</span>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              </div>
            )}

            {/* City Search Form */}
            <form onSubmit={handleCitySubmit} className="space-y-2">
              <input
                type="text"
                value={inputCity}
                onChange={(e) => setInputCity(e.target.value)}
                placeholder="Enter city name..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus={!isGeoSupported}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white 
                           rounded text-sm font-medium transition-colors"
                >
                  Search City
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white 
                           rounded text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 📚 Weather Content */}
        {weather && !isEditing && (
          <div className="flex-1 space-y-4 overflow-y-auto min-h-0">
            
            {/* 📚 Date and Time Display */}
            <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatDateTime(currentTime).time}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateTime(currentTime).date}
              </div>
            </div>
            
            {/* 📚 Current Temperature Display */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                <img
                  src={weatherService.getIconUrl(weather.icon)}
                  alt={weather.description}
                  className="w-16 h-16"
                />
                <div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {weather.temperature}°C
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Feels like {weather.feelsLike}°C
                  </div>
                </div>
              </div>
              
              <div className="capitalize text-lg text-gray-700 dark:text-gray-300 mb-1">
                {weather.description}
              </div>
              
              <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                {useCurrentLocation ? (
                  <>
                    <Navigation className="w-3 h-3" />
                    <span>Current location: {weather.location}</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span>{weather.location}</span>
                  </>
                )}
              </div>
            </div>

            {/* 📚 Weather Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Humidity
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {weather.humidity}%
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Wind className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Wind
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {weather.windSpeed} km/h
                </div>
              </div>
            </div>

            {/* 📚 Last Updated Info */}
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
              <Clock className="w-3 h-3" />
              <span>Updated {lastUpdated}</span>
              {isStale && (
                <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 
                               text-yellow-700 dark:text-yellow-300 rounded text-xs">
                  Stale
                </span>
              )}
            </div>
          </div>
        )}

        {/* 📚 Empty State (no weather data and not loading) */}
        {!weather && !isLoading && !error && !isGeoLoading && (
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="text-center">
              <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No weather data available
              </p>
            </div>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}