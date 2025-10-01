import { useState } from 'react';
import { Newspaper, Clock, ExternalLink, Filter } from 'lucide-react';
import { BaseWidget } from './BaseWidget';
import { useNews } from '../../hooks/useNews';
import { newsService } from '../../services/api/news';
import type { NewsCategory } from '../../services/api/news';

interface NewsWidgetProps {
  initialCategory?: NewsCategory;
  className?: string;
}

export function NewsWidget({ initialCategory = 'technology', className }: NewsWidgetProps) {
  const [category, setCategory] = useState<NewsCategory>(initialCategory);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { 
    articles, 
    isLoading, 
    error, 
    refresh, 
    lastUpdated,
    isStale,
    totalArticles
  } = useNews({ category, pageSize: 6 });

  // 📚 Handle category filter change
  const handleCategoryChange = (newCategory: NewsCategory) => {
    setCategory(newCategory);
    setIsFilterOpen(false);
  };

  // 📚 Handle settings (filter toggle)
  const handleSettings = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // 📚 Open article in new tab
  const openArticle = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 📚 Get category display name
  const getCategoryDisplayName = (cat: NewsCategory): string => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <BaseWidget
      widgetId="news-widget"
      title="News"
      subtitle={`${getCategoryDisplayName(category)} • ${totalArticles} articles`}
      size="large"
      isLoading={isLoading}
      error={error}
      onRefresh={refresh}
      onSettings={handleSettings}
      className={className}
    >
      <div className="h-full flex flex-col min-h-0">
        
        {/* 📚 Category Filter (shown when settings clicked) */}
        {isFilterOpen && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex-shrink-0 max-h-32 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Category Filter
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {newsService.getCategories().map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                    category === cat
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'
                  }`}
                >
                  {getCategoryDisplayName(cat)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 📚 News Articles List */}
        {articles && articles.length > 0 && !isFilterOpen && (
          <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
                         hover:shadow-md dark:hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 
                         transition-all duration-200 cursor-pointer"
                onClick={() => openArticle(article.url)}
              >
                <div className="flex gap-3">
                  {/* 📚 Article Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={article.urlToImage || newsService.getDefaultImage()}
                      alt={article.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-gray-200 dark:bg-gray-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = newsService.getDefaultImage();
                      }}
                    />
                  </div>

                  {/* 📚 Article Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight mb-1 
                                 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-2 line-clamp-2">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{article.source.name}</span>
                        {article.author && (
                          <>
                            <span>•</span>
                            <span>{article.author}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{newsService.getRelativeTime(article.publishedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 📚 External Link Icon */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 📚 Empty State */}
        {articles && articles.length === 0 && !isLoading && !error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">No articles found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Try a different category or check back later
              </p>
            </div>
          </div>
        )}

        {/* 📚 Last Updated Info */}
        {articles && articles.length > 0 && (
          <div className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500 pt-3 mt-3 
                         border-t border-gray-200 dark:border-gray-700">
            <Clock className="w-3 h-3" />
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