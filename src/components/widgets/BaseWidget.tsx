import { RefreshCw, Settings, X, AlertCircle } from 'lucide-react';
import type { BaseWidgetProps } from '../../types/widget.types';

// 📚 BaseWidget provides consistent styling and functionality for all widgets
export function BaseWidget({
  widgetId,
  title,
  subtitle,
  size = 'medium',
  isLoading = false,
  error = null,
  className = '',
  children,
  onRefresh,
  onSettings,
  onRemove,
}: BaseWidgetProps) {
  
  // 📚 Size classes for responsive widget sizing
  const sizeClasses = {
    small: 'h-48',
    medium: 'h-64 lg:h-72',
    large: 'h-80 lg:h-96',
  };

  // 📚 Handle refresh click
  const handleRefresh = () => {
    if (onRefresh && !isLoading) {
      onRefresh();
    }
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
        transition-all duration-200 
        hover:shadow-xl hover:scale-[1.02]
        flex flex-col
        ${sizeClasses[size]}
        ${className}
      `}
      data-widget-id={widgetId}
    >
      {/* 📚 Widget Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* 📚 Widget Actions */}
        <div className="flex items-center gap-1 ml-2">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh data"
              aria-label="Refresh widget data"
            >
              <RefreshCw 
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 
                          ${isLoading ? 'animate-spin' : ''}`} 
              />
            </button>
          )}
          
          {/* Settings Button */}
          {onSettings && (
            <button
              onClick={onSettings}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-colors"
              title="Widget settings"
              aria-label="Open widget settings"
            >
              <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          )}
          
          {/* Remove Button */}
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 
                       transition-colors"
              title="Remove widget"
              aria-label="Remove widget from dashboard"
            >
              <X className="w-4 h-4 text-red-500 dark:text-red-400" />
            </button>
          )}
        </div>
      </div>
      
      {/* 📚 Widget Content Area */}
      <div className="flex-1 p-4 overflow-hidden min-h-0">
        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Something went wrong
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {typeof error === 'string' ? error : error.message}
              </p>
              {onRefresh && (
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white 
                           rounded-lg transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {!error && isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 
                            rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </p>
            </div>
          </div>
        )}
        
        {/* Widget Content */}
        {!error && !isLoading && (
          <div className="h-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}