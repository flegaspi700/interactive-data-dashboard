import { useState } from 'react';
import { Github, Star, GitFork, MapPin, Calendar, ExternalLink, Code } from 'lucide-react';
import { BaseWidget } from './BaseWidget';
import { useGitHub } from '../../hooks/useGitHub';
import { githubService } from '../../services/api/github';

interface GitHubWidgetProps {
  initialUsername?: string;
  className?: string;
}

export function GitHubWidget({ initialUsername = 'flegaspi700', className }: GitHubWidgetProps) {
  const [username, setUsername] = useState(initialUsername);
  const [inputUsername, setInputUsername] = useState(username);
  const [isEditing, setIsEditing] = useState(false);

  const { 
    stats, 
    isLoading, 
    error, 
    refresh, 
    lastUpdated,
    isStale,
    hasToken,
    rateLimit
  } = useGitHub({ username });

  // 📚 Handle username search
  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      setUsername(inputUsername.trim());
      setIsEditing(false);
    }
  };

  // 📚 Handle settings (username selection)
  const handleSettings = () => {
    setIsEditing(true);
    setInputUsername(username);
  };

  // 📚 Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setInputUsername(username);
  };

  // 📚 Open GitHub link in new tab
  const openGitHub = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <BaseWidget
      widgetId="github-widget"
      title="GitHub"
      subtitle={stats ? `@${stats.user.login}` : 'Loading...'}
      size="large"
      isLoading={isLoading}
      error={error}
      onRefresh={refresh}
      onSettings={handleSettings}
      className={className}
    >
      <div className="h-full flex flex-col min-h-0">
        
        {/* 📚 Username Search Form (shown when editing) */}
        {isEditing && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex-shrink-0">
            <form onSubmit={handleUsernameSubmit} className="space-y-2">
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="Enter GitHub username..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white 
                           rounded text-sm font-medium transition-colors"
                >
                  Search
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

        {/* 📚 GitHub Stats Content */}
        {stats && !isEditing && (
          <div className="flex-1 space-y-4 overflow-y-auto min-h-0">
            
            {/* 📚 User Profile Section */}
            <div className="flex items-start gap-3">
              <img
                src={stats.user.avatar_url}
                alt={stats.user.login}
                className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {stats.user.name || stats.user.login}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  @{stats.user.login}
                </p>
                {stats.user.bio && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                    {stats.user.bio}
                  </p>
                )}
                {stats.user.location && (
                  <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400 text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>{stats.user.location}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => openGitHub(`https://github.com/${stats.user.login}`)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* 📚 Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {githubService.formatNumber(stats.user.public_repos)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Repositories</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {githubService.formatNumber(stats.user.followers)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {githubService.formatNumber(stats.totalStars)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Stars</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {githubService.formatNumber(stats.totalForks)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Forks</div>
              </div>
            </div>

            {/* 📚 Top Languages */}
            {stats.primaryLanguages.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Top Languages
                </h4>
                <div className="space-y-2">
                  {stats.primaryLanguages.slice(0, 3).map((lang) => (
                    <div key={lang.language} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: githubService.getLanguageColor(lang.language) }}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {lang.language}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {lang.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 📚 Recent Repositories */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Github className="w-4 h-4" />
                Recent Repositories
              </h4>
              <div className="space-y-2">
                {stats.repositories.slice(0, 3).map((repo) => (
                  <div
                    key={repo.id}
                    className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 
                             hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
                    onClick={() => openGitHub(repo.html_url)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {repo.name}
                        </h5>
                        {repo.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {repo.language && (
                            <div className="flex items-center gap-1">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: githubService.getLanguageColor(repo.language) }}
                              />
                              <span>{repo.language}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            <span>{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="w-3 h-3" />
                            <span>{repo.forks_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 📚 API Info */}
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
              Rate limit: {rateLimit} • {hasToken ? 'Authenticated' : 'Public access'}
            </div>
          </div>
        )}

        {/* 📚 Empty State */}
        {!stats && !isLoading && !error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Github className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No GitHub data available
              </p>
            </div>
          </div>
        )}

        {/* 📚 Last Updated Info */}
        {stats && (
          <div className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500 pt-3 mt-3 
                         border-t border-gray-200 dark:border-gray-700">
            <Calendar className="w-3 h-3" />
            <span>Updated {lastUpdated}</span>
            {isStale && (
              <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 
                             text-yellow-700 dark:text-yellow-300 rounded text-xs">
                Stale
              </span>
            )}
          </div>
        )}
      </div>
    </BaseWidget>
  );
}