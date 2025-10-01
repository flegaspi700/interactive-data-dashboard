import axios from 'axios';

// 📚 GitHub API Types
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  size: number;
  default_branch: string;
  open_issues_count: number;
  visibility: string;
  pushed_at: string;
}

export interface GitHubStats {
  user: GitHubUser;
  repositories: GitHubRepository[];
  totalStars: number;
  totalForks: number;
  primaryLanguages: Array<{ language: string; count: number; percentage: number }>;
  recentActivity: GitHubRepository[];
}

export interface GitHubError {
  message: string;
  documentation_url?: string;
}

// 📚 GitHub API Service
class GitHubService {
  private readonly baseUrl = 'https://api.github.com';
  private readonly token = import.meta.env.VITE_GITHUB_TOKEN;

  // 📚 Get headers with authentication
  private getHeaders() {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Dashboard-App/1.0.0'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // 📚 Get user profile information
  async getUserProfile(username: string): Promise<GitHubUser> {
    try {
      const response = await axios.get<GitHubUser>(`${this.baseUrl}/users/${username}`, {
        headers: this.getHeaders(),
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, `fetching user profile for ${username}`);
    }
  }

  // 📚 Get user repositories
  async getUserRepositories(username: string, limit: number = 10): Promise<GitHubRepository[]> {
    try {
      const response = await axios.get<GitHubRepository[]>(`${this.baseUrl}/users/${username}/repos`, {
        headers: this.getHeaders(),
        params: {
          sort: 'updated',
          direction: 'desc',
          per_page: Math.min(limit, 100), // GitHub max is 100
          type: 'public'
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, `fetching repositories for ${username}`);
    }
  }

  // 📚 Get comprehensive GitHub stats for a user
  async getUserStats(username: string): Promise<GitHubStats> {
    try {
      // Fetch user profile and repositories in parallel
      const [user, repositories] = await Promise.all([
        this.getUserProfile(username),
        this.getUserRepositories(username, 30) // Get more repos for better stats
      ]);

      // Calculate total stars and forks
      const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);

      // Calculate primary languages
      const languageCounts = repositories.reduce((acc, repo) => {
        if (repo.language) {
          acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const totalRepos = repositories.filter(repo => repo.language).length;
      const primaryLanguages = Object.entries(languageCounts)
        .map(([language, count]) => ({
          language,
          count,
          percentage: Math.round((count / totalRepos) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 languages

      // Get recent activity (recently updated repos)
      const recentActivity = repositories
        .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
        .slice(0, 5);

      return {
        user,
        repositories: repositories.slice(0, 10), // Return top 10 repos for display
        totalStars,
        totalForks,
        primaryLanguages,
        recentActivity
      };
    } catch (error) {
      throw this.handleError(error, `fetching stats for ${username}`);
    }
  }

  // 📚 Get rate limit information
  async getRateLimit(): Promise<{ limit: number; remaining: number; reset: Date }> {
    try {
      const response = await axios.get(`${this.baseUrl}/rate_limit`, {
        headers: this.getHeaders(),
        timeout: 5000
      });

      const { limit, remaining, reset } = response.data.rate;
      return {
        limit,
        remaining,
        reset: new Date(reset * 1000)
      };
    } catch (error) {
      throw this.handleError(error, 'fetching rate limit');
    }
  }

  // 📚 Handle API errors
  private handleError(error: any, context: string): Error {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return new Error(`GitHub user not found. Please check the username.`);
      }
      if (error.response?.status === 401) {
        return new Error(`GitHub authentication failed. Please check your VITE_GITHUB_TOKEN.`);
      }
      if (error.response?.status === 403) {
        const rateLimitReset = error.response.headers['x-ratelimit-reset'];
        if (rateLimitReset) {
          const resetTime = new Date(parseInt(rateLimitReset) * 1000);
          return new Error(`GitHub rate limit exceeded. Resets at ${resetTime.toLocaleTimeString()}.`);
        }
        return new Error('GitHub API access forbidden. Check your token permissions.');
      }
      if (error.response?.status === 422) {
        return new Error('Invalid GitHub username format.');
      }

      const errorData = error.response?.data as GitHubError;
      if (errorData?.message) {
        return new Error(`GitHub API error: ${errorData.message}`);
      }
    }

    if (error.code === 'ECONNABORTED') {
      return new Error(`GitHub API timeout while ${context}. Please try again.`);
    }

    return new Error(`Failed to fetch GitHub data. Please check your internet connection.`);
  }

  // 📚 Get relative time string
  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 30) return `${diffInDays}d ago`;
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    return `${diffInYears}y ago`;
  }

  // 📚 Format large numbers
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // 📚 Get language color (common GitHub language colors)
  getLanguageColor(language: string): string {
    const colors: Record<string, string> = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C': '#555555',
      'C#': '#239120',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Vue': '#2c3e50',
      'React': '#61dafb',
      'Shell': '#89e051',
      'Dockerfile': '#384d54'
    };
    return colors[language] || '#586069';
  }

  // 📚 Check if token is configured
  isTokenConfigured(): boolean {
    return !!this.token && this.token !== 'your_github_token_here';
  }

  // 📚 Get API info for display
  getApiInfo(): { hasToken: boolean; rateLimit: string } {
    const hasToken = this.isTokenConfigured();
    const rateLimit = hasToken ? '5,000/hour' : '60/hour';
    return { hasToken, rateLimit };
  }
}

// 📚 Export singleton instance
export const githubService = new GitHubService();