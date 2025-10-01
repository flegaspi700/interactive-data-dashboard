import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import Header from './components/layout/Header';
import { DashboardGrid } from './components/layout/DashboardGrid';
import { DraggableWidget } from './components/layout/DraggableWidget';
import { WeatherWidget } from './components/widgets/WeatherWidget';
import { NewsWidget } from './components/widgets/NewsWidget';
import { GitHubWidget } from './components/widgets/GitHubWidget';
import { CryptoWidget } from './components/widgets/CryptoWidget';
import { QuotesWidget } from './components/widgets/QuotesWidget';
import { PlaceholderWidget } from './components/widgets/PlaceholderWidget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 📚 React Query client for data fetching and caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true, // Refetch when window regains focus
      retry: 1, // Retry once on failure
    },
  },
});

function App() {
  // 📚 Load widget order from localStorage or use default
  const [widgetOrder, setWidgetOrder] = useState(() => {
    const saved = localStorage.getItem('widget-order');
    return saved ? JSON.parse(saved) : ['weather', 'news', 'github', 'crypto', 'quotes', 'placeholder'];
  });

  // 📚 Save to localStorage whenever order changes
  useEffect(() => {
    localStorage.setItem('widget-order', JSON.stringify(widgetOrder));
  }, [widgetOrder]);

  // 📚 Widget definitions
  const widgets = {
    weather: <WeatherWidget />,
    news: <NewsWidget initialCategory="technology" />,
    github: <GitHubWidget initialUsername="flegaspi700" />,
    crypto: <CryptoWidget initialLimit={6} />,
    quotes: <QuotesWidget initialCategory="motivational" />,
    placeholder: <PlaceholderWidget title="More Widgets" color="purple" />
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div className="h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <DashboardGrid onReorder={setWidgetOrder}>
              {widgetOrder.map((widgetId: string) => (
                <DraggableWidget key={widgetId} id={widgetId}>
                  {widgets[widgetId as keyof typeof widgets]}
                </DraggableWidget>
              ))}
            </DashboardGrid>
          </div>
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
