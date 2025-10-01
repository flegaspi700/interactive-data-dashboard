import { BaseWidget } from './BaseWidget';

interface PlaceholderWidgetProps {
  title: string;
  color?: string;
}

export function PlaceholderWidget({ title, color = 'blue' }: PlaceholderWidgetProps) {
  // 📚 Dynamic color classes based on prop
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  }[color] || 'from-blue-500 to-blue-600';

  // 📚 Mock functions to demonstrate BaseWidget functionality
  const handleRefresh = () => {
    console.log(`Refreshing ${title} widget...`);
  };

  const handleSettings = () => {
    console.log(`Opening settings for ${title} widget...`);
  };

  const handleRemove = () => {
    console.log(`Removing ${title} widget...`);
  };

  return (
    <BaseWidget
      widgetId={`placeholder-${title.toLowerCase().replace(/\s+/g, '-')}`}
      title={title}
      subtitle="Coming soon..."
      size="medium"
      onRefresh={handleRefresh}
      onSettings={handleSettings}
      onRemove={handleRemove}
    >
      {/* 📚 Widget content using BaseWidget as wrapper */}
      <div className="h-full flex flex-col">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${colorClasses} rounded-lg p-4 mb-4`}>
          <h3 className="text-lg font-bold text-white">Preview Widget</h3>
        </div>
        
        {/* Content area with skeleton loading animation */}
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
          
          {/* Mock chart area */}
          <div className="mt-4 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              📊 Chart placeholder
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Widget will be implemented in Phase 2
          </p>
        </div>
      </div>
    </BaseWidget>
  );
}