// 📚 Base interfaces for all widgets in the dashboard

export interface BaseWidgetProps {
  // 📚 Unique identifier for the widget instance
  widgetId: string;
  
  // 📚 Display title for the widget
  title: string;
  
  // 📚 Optional subtitle or description
  subtitle?: string;
  
  // 📚 Widget size configuration
  size?: 'small' | 'medium' | 'large';
  
  // 📚 Loading state
  isLoading?: boolean;
  
  // 📚 Error state and message
  error?: Error | string | null;
  
  // 📚 Custom CSS classes
  className?: string;
  
  // 📚 Widget content
  children?: React.ReactNode;
  
  // 📚 Refresh function for manual data reload
  onRefresh?: () => void;
  
  // 📚 Settings/configuration callback
  onSettings?: () => void;
  
  // 📚 Remove widget callback
  onRemove?: () => void;
}

// 📚 Widget state for management
export interface WidgetState {
  id: string;
  type: 'weather' | 'crypto' | 'github' | 'news' | 'placeholder';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isVisible: boolean;
  config: Record<string, any>;
  lastUpdated?: Date;
}

// 📚 Widget configuration options
export interface WidgetConfig {
  // 📚 Auto-refresh interval in milliseconds
  refreshInterval?: number;
  
  // 📚 Widget-specific settings
  settings?: Record<string, any>;
  
  // 📚 API configuration
  apiConfig?: {
    endpoint: string;
    params?: Record<string, any>;
    headers?: Record<string, string>;
  };
}

// 📚 API response wrapper for consistent error handling
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error' | 'loading';
  error?: string;
  lastUpdated: Date;
}

// 📚 Widget registry for dynamic loading
export interface WidgetRegistry {
  [key: string]: {
    component: React.ComponentType<any>;
    title: string;
    description: string;
    icon: string;
    defaultConfig: WidgetConfig;
  };
}