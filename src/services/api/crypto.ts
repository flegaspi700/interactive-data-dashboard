import axios from 'axios';

// 📚 Base URL for CoinGecko API (free, no key needed!)
const BASE_URL = 'https://api.coingecko.com/api/v3';

// 📚 Interface for crypto coin data
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  image: string;
  sparkline: number[];
}

// 📚 Raw API response from CoinGecko
interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

// 📚 Service to fetch cryptocurrency data
export const cryptoService = {
  // Get top cryptocurrencies
  async getTopCoins(limit: number = 5): Promise<CryptoData[]> {
    try {
      const response = await axios.get<CoinGeckoResponse[]>(
        `${BASE_URL}/coins/markets`,
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: limit,
            page: 1,
            sparkline: true, // Include 7-day price history
            locale: 'en',
          },
        }
      );

      // 📚 Transform API response to our format
      return response.data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        currentPrice: coin.current_price,
        priceChange24h: coin.price_change_24h,
        priceChangePercentage24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        image: coin.image,
        sparkline: coin.sparkline_in_7d?.price.slice(-24) || [], // Last 24 hours
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      throw new Error('Failed to fetch cryptocurrency data');
    }
  },

  // Format price with currency symbol
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  },

  // Format market cap (e.g., 1234567890 → $1.23B)
  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toFixed(0)}`;
  },
};