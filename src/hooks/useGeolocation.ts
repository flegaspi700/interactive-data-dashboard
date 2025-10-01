import { useState, useEffect } from 'react';

// 📚 Geolocation coordinates interface
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// 📚 Geolocation hook return interface
export interface UseGeolocationReturn {
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  requestLocation: () => void;
  hasPermission: boolean;
}

// 📚 Custom hook for browser geolocation
export function useGeolocation(): UseGeolocationReturn {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // 📚 Check if geolocation is supported
  const isSupported = 'geolocation' in navigator;

  // 📚 Get current position
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds
          maximumAge: 300000, // 5 minutes cache
        }
      );
    });
  };

  // 📚 Request location function
  const requestLocation = async () => {
    if (!isSupported) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      
      setCoordinates(coords);
      setHasPermission(true);
      setError(null);
    } catch (err) {
      const error = err as GeolocationPositionError;
      let errorMessage = 'Failed to get your location';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location permissions.';
          setHasPermission(false);
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.';
          break;
        default:
          errorMessage = 'An unknown error occurred while getting location.';
          break;
      }
      
      setError(errorMessage);
      setCoordinates(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 📚 Check permission status on mount
  useEffect(() => {
    if (!isSupported) return;

    // Check if we already have permission
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          setHasPermission(true);
          // Automatically get location if permission is already granted
          requestLocation();
        } else if (result.state === 'denied') {
          setHasPermission(false);
          setError('Location access denied. Please enable location permissions in your browser.');
        }
      }).catch(() => {
        // Fallback for browsers that don't support permissions API
        console.log('Permissions API not supported');
      });
    }
  }, [isSupported]);

  return {
    coordinates,
    isLoading,
    error,
    isSupported,
    requestLocation,
    hasPermission,
  };
}