import axios from 'axios';

// 📚 NewsAPI Types
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface NewsError {
  code: string;
  message: string;
}

// 📚 News Categories supported by NewsAPI
export type NewsCategory = 
  | 'general' 
  | 'business' 
  | 'entertainment' 
  | 'health' 
  | 'science' 
  | 'sports' 
  | 'technology';

export interface NewsFilters {
  category?: NewsCategory;
  country?: string;
  sources?: string;
  q?: string; // Search query
  pageSize?: number;
  page?: number;
}

// 📚 NewsAPI Service
class NewsService {
  private readonly baseUrl = 'https://newsapi.org/v2';
  private readonly apiKey = import.meta.env.VITE_NEWS_API_KEY;

  // 📚 Get top headlines with optional filters
  async getTopHeadlines(filters: NewsFilters = {}): Promise<NewsArticle[]> {
    if (!this.apiKey) {
      throw new Error('NewsAPI key not configured. Please add VITE_NEWS_API_KEY to your environment variables.');
    }

    try {
      const {
        category = 'technology',
        country = 'us',
        pageSize = 10,
        page = 1,
        q,
        sources
      } = filters;

      const response = await axios.get<NewsResponse>(`${this.baseUrl}/top-headlines`, {
        params: {
          apiKey: this.apiKey,
          category: !sources ? category : undefined, // Can't use category with sources
          country: !sources ? country : undefined,   // Can't use country with sources
          sources,
          q,
          pageSize: Math.min(pageSize, 20), // Max 20 for free tier
          page
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.data.status !== 'ok') {
        throw new Error(`NewsAPI error: ${response.data.status}`);
      }

      return this.transformArticles(response.data.articles);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid NewsAPI key. Please check your VITE_NEWS_API_KEY.');
        }
        if (error.response?.status === 429) {
          throw new Error('NewsAPI rate limit exceeded. You have reached your daily quota.');
        }
        if (error.response?.status === 426) {
          throw new Error('NewsAPI upgrade required. This endpoint requires a paid subscription.');
        }
        
        const errorData = error.response?.data as NewsError;
        if (errorData?.message) {
          throw new Error(`NewsAPI error: ${errorData.message}`);
        }
      }
      
      throw new Error('Failed to fetch news. Please check your internet connection.');
    }
  }

  // 📚 Search everything (requires paid plan for production)
  async searchEverything(query: string, filters: Omit<NewsFilters, 'category' | 'country'> = {}): Promise<NewsArticle[]> {
    if (!this.apiKey) {
      throw new Error('NewsAPI key not configured.');
    }

    try {
      const {
        pageSize = 10,
        page = 1,
        sources
      } = filters;

      const response = await axios.get<NewsResponse>(`${this.baseUrl}/everything`, {
        params: {
          apiKey: this.apiKey,
          q: query,
          sources,
          pageSize: Math.min(pageSize, 20),
          page,
          sortBy: 'publishedAt',
          language: 'en'
        },
        timeout: 10000
      });

      return this.transformArticles(response.data.articles);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 426) {
          // For free tier, fall back to top headlines with search
          return this.getTopHeadlines({ q: query, ...filters });
        }
      }
      throw error;
    }
  }

  // 📚 Transform raw API articles to our format
  private transformArticles(articles: any[]): NewsArticle[] {
    return articles
      .filter(article => 
        article.title && 
        article.title !== '[Removed]' && 
        article.description &&
        article.url
      )
      .map((article, index) => ({
        id: `${article.publishedAt}-${index}`, // Create unique ID
        title: this.cleanTitle(article.title),
        description: this.cleanDescription(article.description),
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: {
          id: article.source?.id || null,
          name: article.source?.name || 'Unknown Source'
        },
        author: article.author,
        content: article.content
      }));
  }

  // 📚 Clean up article titles
  private cleanTitle(title: string): string {
    // Remove common trailing patterns like " - CNN", " | Reuters"
    return title.replace(/\s*[-|]\s*[^-|]*$/, '').trim();
  }

  // 📚 Clean up article descriptions
  private cleanDescription(description: string): string {
    // Truncate very long descriptions
    if (description.length > 200) {
      return description.substring(0, 197) + '...';
    }
    return description;
  }

  // 📚 Get relative time string
  getRelativeTime(publishedAt: string): string {
    const published = new Date(publishedAt);
    const now = new Date();
    const diffInMs = now.getTime() - published.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return published.toLocaleDateString();
  }

  // 📚 Get available categories for filtering
  getCategories(): NewsCategory[] {
    return ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
  }

  // 📚 Get default image for articles without images
  getDefaultImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBmaWxsPSIjRDFENU5COiAvPgo8cGF0aCBkPSJNMTM3LjUgOTMuNzVMMTYyLjUgMTEyLjVIMTM3LjVWOTMuNzVaIiBmaWxsPSIjOUNBM0FGIi8+CjwvZz4KPC9zdmc+';
  }
}

// 📚 Export singleton instance
export const newsService = new NewsService();