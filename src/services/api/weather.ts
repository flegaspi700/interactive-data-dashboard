import axios from 'axios';

// 📚 Base URL for OpenWeatherMap API
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// 📚 TypeScript interface for weather response
export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  timestamp: number;
}

// 📚 Interface for forecast data
export interface ForecastItem {
  date: string;
  temp: number;
  description: string;
  icon: string;
}

// 📚 Raw API response (what OpenWeatherMap actually returns)
interface OpenWeatherResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  dt: number;
}

// 📚 Service to fetch current weather
export const weatherService = {
  // Get current weather by city name
  async getCurrentWeather(city: string = 'Manila'): Promise<WeatherData> {
    try {
      const response = await axios.get<OpenWeatherResponse>(
        `${BASE_URL}/weather`,
        {
          params: {
            q: city,
            appid: API_KEY,
            units: 'metric', // Celsius
          },
        }
      );

      // 📚 Transform API response to our format
      return {
        location: response.data.name,
        temperature: Math.round(response.data.main.temp),
        feelsLike: Math.round(response.data.main.feels_like),
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        humidity: response.data.main.humidity,
        windSpeed: Math.round(response.data.wind.speed * 3.6), // m/s to km/h
        timestamp: response.data.dt * 1000, // Convert to milliseconds
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error('Failed to fetch weather data');
    }
  },

  // Get current weather by coordinates (latitude, longitude)
  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get<OpenWeatherResponse>(
        `${BASE_URL}/weather`,
        {
          params: {
            lat: lat.toFixed(4), // Round to 4 decimal places
            lon: lon.toFixed(4),
            appid: API_KEY,
            units: 'metric', // Celsius
          },
        }
      );

      // 📚 Transform API response to our format
      return {
        location: response.data.name,
        temperature: Math.round(response.data.main.temp),
        feelsLike: Math.round(response.data.main.feels_like),
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        humidity: response.data.main.humidity,
        windSpeed: Math.round(response.data.wind.speed * 3.6), // m/s to km/h
        timestamp: response.data.dt * 1000, // Convert to milliseconds
      };
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      throw new Error('Failed to fetch weather data for your location');
    }
  },

  // Get weather icon URL
  getIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },
};