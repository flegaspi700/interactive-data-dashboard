import { useState } from 'react';
import { Quote, Settings, Sparkles, Heart, RefreshCw } from 'lucide-react';
import { BaseWidget } from './BaseWidget';
import { useQuotes } from '../../hooks/useQuotes';
import { quotesService, type QuoteCategory } from '../../services/api/quotes';

interface QuotesWidgetProps {
  initialCategory?: QuoteCategory;
  className?: string;
}

export function QuotesWidget({ initialCategory = 'inspirational', className }: QuotesWidgetProps) {
  const [category, setCategory] = useState<QuoteCategory>(initialCategory);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 📚 Quotes hook
  const { 
    quote, 
    isLoading, 
    error, 
    refresh, 
    lastUpdated,
    isStale 
  } = useQuotes({ category });

  // 📚 Handle category change
  const handleCategoryChange = (newCategory: QuoteCategory) => {
    setCategory(newCategory);
    setIsSettingsOpen(false);
  };

  // 📚 Handle settings toggle
  const handleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // 📚 Get category display name
  const getCategoryDisplayName = (cat: QuoteCategory): string => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // 📚 Get category emoji
  const getCategoryEmoji = (cat: QuoteCategory): string => {
    const emojiMap: Record<QuoteCategory, string> = {
      'random': '🎲',
      'motivational': '💪',
      'inspirational': '✨',
      'success': '🏆',
      'happiness': '😊',
      'wisdom': '🧠',
      'life': '🌟'
    };
    return emojiMap[cat] || '💭';
  };

  return (
    <BaseWidget
      widgetId="quotes-widget"
      title="Daily Inspiration"
      subtitle={`${getCategoryEmoji(category)} ${getCategoryDisplayName(category)} quotes`}
      size="large"
      isLoading={isLoading}
      error={error}
      onRefresh={refresh}
      onSettings={handleSettings}
      className={className}
    >
      <div className="h-full flex flex-col min-h-0">
        
        {/* 📚 Category Settings (shown when settings clicked) */}
        {isSettingsOpen && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex-shrink-0 max-h-32 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quote Category
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quotesService.getCategories().map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors flex items-center gap-1 ${
                    category === cat
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'
                  }`}
                >
                  <span>{getCategoryEmoji(cat)}</span>
                  <span className="text-xs">{getCategoryDisplayName(cat)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 📚 Quote Display */}
        {quote && !isSettingsOpen && (
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 p-2 overflow-y-auto min-h-0">
            
            {/* 📚 Quote Icon */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Quote className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-yellow-800" />
              </div>
            </div>

            {/* 📚 Quote Text */}
            <div className="flex-1 flex flex-col justify-center max-w-full">
              <blockquote className="text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200 font-medium italic mb-4 px-2">
                "{quote.text}"
              </blockquote>
              
              {/* 📚 Author */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>—</span>
                <span className="font-semibold">{quote.author}</span>
              </div>
            </div>

            {/* 📚 Quote Stats & Actions */}
            <div className="w-full space-y-3 mt-4">
              
              {/* 📚 Category Badge */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                  {getCategoryEmoji(category)}
                  {getCategoryDisplayName(category)}
                </span>
              </div>

              {/* 📚 Quote Length & Refresh */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
                <span>{quote.length} characters</span>
                <button
                  onClick={refresh}
                  disabled={isLoading}
                  className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  title="Get new quote"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  New Quote
                </button>
              </div>

              {/* 📚 Last Updated */}
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Heart className="w-3 h-3" />
                <span>Updated {lastUpdated}</span>
                {isStale && (
                  <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 
                                 text-yellow-700 dark:text-yellow-300 rounded text-xs">
                    Stale
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 📚 Empty State (no quote data and not loading) */}
        {!quote && !isLoading && !error && !isSettingsOpen && (
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="text-center">
              <Quote className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No inspirational quotes available
              </p>
              <button
                onClick={refresh}
                className="mt-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white 
                         rounded-lg text-sm font-medium transition-colors"
              >
                Load Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}