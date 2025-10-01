import axios from 'axios';

// 📚 Quote interface for API response
interface QuotableQuote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  length: number;
}

// 📚 Our standardized quote interface
export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  length: number;
}

// 📚 Quotable API base URL (free, no auth required)
const BASE_URL = 'https://api.quotable.io';

// 📚 Quote categories for filtering
export type QuoteCategory = 'motivational' | 'inspirational' | 'success' | 'happiness' | 'wisdom' | 'life' | 'random';

export const quotesService = {
  // Get categories for quote filtering
  getCategories(): QuoteCategory[] {
    return ['random', 'motivational', 'inspirational', 'success', 'happiness', 'wisdom', 'life'];
  },

  // Get a random quote by category
  async getRandomQuote(category: QuoteCategory = 'random'): Promise<Quote> {
    try {
      const params: any = {};
      
      // Map our categories to Quotable API tags
      if (category !== 'random') {
        const tagMap: Record<QuoteCategory, string> = {
          'random': '',
          'motivational': 'motivational',
          'inspirational': 'inspirational',
          'success': 'success',
          'happiness': 'happiness',
          'wisdom': 'wisdom',
          'life': 'life'
        };
        
        if (tagMap[category]) {
          params.tags = tagMap[category];
        }
      }

      const response = await axios.get<QuotableQuote>(`${BASE_URL}/random`, {
        params,
        timeout: 5000,
      });

      // Transform API response to our format
      return {
        id: response.data._id,
        text: response.data.content,
        author: response.data.author,
        category: response.data.tags[0] || 'inspirational',
        length: response.data.length,
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      
      // Fallback quote if API fails
      return {
        id: 'fallback-1',
        text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
        author: 'Chinese Proverb',
        category: 'wisdom',
        length: 80,
      };
    }
  },

  // Get multiple quotes for variety
  async getQuotes(count: number = 3, category: QuoteCategory = 'random'): Promise<Quote[]> {
    try {
      const quotes: Quote[] = [];
      
      // Fetch multiple random quotes
      for (let i = 0; i < count; i++) {
        const quote = await this.getRandomQuote(category);
        quotes.push(quote);
        
        // Small delay to avoid rate limiting
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      return quotes;
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      
      // Return fallback quotes
      return [
        {
          id: 'fallback-1',
          text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
          author: 'Chinese Proverb',
          category: 'wisdom',
          length: 80,
        },
        {
          id: 'fallback-2',
          text: 'Your limitation—it\'s only your imagination.',
          author: 'Unknown',
          category: 'motivational',
          length: 42,
        },
        {
          id: 'fallback-3',
          text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
          author: 'Winston Churchill',
          category: 'success',
          length: 86,
        },
      ];
    }
  },

  // Get quote of the day (cached for 24 hours)
  async getQuoteOfTheDay(): Promise<Quote> {
    try {
      // Use today's date as seed for consistent daily quote
      const today = new Date().toDateString();
      const storedQuote = localStorage.getItem(`quote-of-day-${today}`);
      
      if (storedQuote) {
        return JSON.parse(storedQuote);
      }

      // Fetch new quote for today
      const quote = await this.getRandomQuote('inspirational');
      
      // Store in localStorage for 24-hour caching
      localStorage.setItem(`quote-of-day-${today}`, JSON.stringify(quote));
      
      return quote;
    } catch (error) {
      console.error('Error fetching quote of the day:', error);
      return this.getRandomQuote('inspirational');
    }
  },
};