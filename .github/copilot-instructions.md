# Interactive Data Dashboard - AI Coding Agent Instructions

## 📋 Essential Documentation
**READ THESE FIRST** for complete project context:
- `interactive-dashboard-prd.md` - Full product requirements & technical specifications
- `learning-companion-doc.md` - In-depth explanations of technology choices and patterns
- `ai-tool-prompt.md` - Ready-to-use prompts for AI coding assistants

## 📝 AI Session Documentation Workflow
**CRITICAL for Continuity**: Document every significant AI coding session to preserve knowledge and decisions.

### When to Create Session Files
- Multi-step feature implementations
- Architecture decisions or pattern establishment
- Complex problem-solving sessions
- API integration work
- Debugging sessions with important discoveries

### Session File Naming
```
sessions/YYYY-MM-DD-topic-name.md
Example: sessions/2025-09-29-copilot-instructions-setup.md
```

## Project Overview
A customizable real-time dashboard project built with React 19 + TypeScript + Vite. Currently in initial setup phase.

**Current State**: Fresh Vite starter template with basic React counter component  
**Goal**: Build a dashboard that aggregates data from multiple public APIs (weather, GitHub stats, cryptocurrency prices, news feeds) with drag-and-drop widgets, theme switching, and responsive design.

## Current Architecture
- **Frontend**: React 19 + TypeScript + Vite (basic setup)
- **Build System**: Vite 7.x with TypeScript 5.8, ESLint 9.x
- **Current Dependencies**: React 19.1.1, react-dom 19.1.1
- **Development**: Standard Vite dev server with HMR

## Planned Architecture (Implementation Target)
- **Styling**: Tailwind CSS + Shadcn/ui components + Framer Motion
- **State Management**: React Context (theme), Zustand (layout), React Query (API data)
- **Data Sources**: OpenWeatherMap, GitHub REST API, CoinGecko, NewsAPI  
- **Build System**: Vite with TypeScript, PostCSS, and Tailwind

### API Integration Details
- **OpenWeatherMap**: `api.openweathermap.org/data/2.5/weather` (60 calls/min)
- **GitHub REST**: `api.github.com/users/{username}` (60 calls/hr unauthenticated)
- **CoinGecko**: `api.coingecko.com/api/v3/coins/markets` (10-50 calls/min)
- **NewsAPI**: `newsapi.org/v2/top-headlines` (100 requests/day free tier)

## Development Workflow

### Current Commands
```bash
npm run dev         # Start dev server (Vite 7.x) - localhost:5173
npm run build       # Production build (TypeScript + Vite)
npm run preview     # Preview production build
npm run lint        # ESLint checking (v9.x with TypeScript)
```

### Current Project Structure
```
dashboard-app/
├── src/
│   ├── App.tsx          # Current: Basic counter component
│   ├── main.tsx         # React 19 entry point
│   ├── index.css        # Basic styles
│   └── assets/          # Static assets
├── package.json         # React 19.1.1, TypeScript 5.8
├── vite.config.ts       # Vite 7.x configuration
├── tsconfig.json        # TypeScript configuration
└── eslint.config.js     # ESLint 9.x configuration
```

### Next Development Steps
1. Install dashboard dependencies (Tailwind, Shadcn/ui, state management)
2. Set up base layout and routing structure  
3. Implement widget system architecture
4. Add API integrations and data management

### Development Workflow Tips
- **Use PRD for requirements**: Reference `interactive-dashboard-prd.md` for complete feature specs
- **Copy AI prompts**: Use examples from `ai-tool-prompt.md` for consistent AI interactions
- **Check learning docs**: Consult `learning-companion-doc.md` for "why" behind technology choices
- **Start simple**: Begin with Weather widget (easiest API) before complex GitHub integration

## Planned Implementation Phases

### Phase 1: Foundation Setup
- Install Tailwind CSS + PostCSS + Autoprefixer
- Set up Shadcn/ui component library
- Configure basic theming (light/dark mode)
- Create basic layout structure

### Phase 2: Widget System
- Implement BaseWidget wrapper component
- Create widget registration and management system
- Add drag-and-drop functionality with react-grid-layout or dnd-kit
- Set up Zustand store for layout state

**Widget Specifications (from PRD)**:
- **Weather**: Current conditions, 5-day forecast, location search
- **GitHub**: User stats, repository list, contribution graph, recent activity
- **Crypto**: Real-time prices, 24h changes, trend charts, market cap
- **News**: Tech headlines, article previews, category filtering

### Phase 3: Data Integration
- Set up React Query for API state management
- Implement API services for each data source
- Create custom hooks for each widget type
- Add error boundaries and loading states

### Phase 4: Polish & Performance
- Add animations with Framer Motion
- Implement responsive design patterns
- Optimize bundle size and performance
- Add comprehensive error handling

## Code Patterns & Conventions (Implementation Target)

### Widget System Architecture
- **BaseWidget**: Wrapper component providing consistent styling, error boundaries, loading states
- **Self-contained widgets**: Each widget manages its own data fetching via custom hooks
- **Layout communication**: Widgets communicate position changes through Zustand store
- **Configuration persistence**: Widget settings stored in localStorage as JSON

```typescript
// Widget Pattern Example
export const WeatherWidget = ({ widgetId, position }: WidgetProps) => {
  const { data, isLoading, error } = useWeather();
  const { updateWidgetPosition } = useDashboardStore();
  
  return (
    <BaseWidget
      title="Weather"
      widgetId={widgetId}
      onPositionChange={updateWidgetPosition}
      isLoading={isLoading}
      error={error}
    >
      {/* Widget content */}
    </BaseWidget>
  );
};
```

### API Integration Pattern
```typescript
// services/api/weather.ts
export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    {
      params: { q: city, appid: import.meta.env.VITE_WEATHER_API_KEY, units: 'metric' },
      timeout: 5000
    }
  );
  return transformWeatherResponse(response.data);
};

// hooks/useWeather.ts
export const useWeather = (city: string = 'London') => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: () => fetchWeatherData(city),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};
```
// Rate limits: GitHub (60/hr), OpenWeatherMap (60/min), CoinGecko (10-50/min), NewsAPI (100/day)

// Error Handling for APIs
const handleApiError = (error: AxiosError, widgetType: string) => {
  if (error.response?.status === 429) {
    return { type: 'RATE_LIMIT', message: 'Rate limit exceeded. Try again later.' };
  }
  if (error.response?.status === 401) {
    return { type: 'AUTH_ERROR', message: 'Invalid API key. Check environment variables.' };
  }
  return { type: 'NETWORK_ERROR', message: `Failed to fetch ${widgetType} data.` };
};

### Component Structure Standards
- Functional components with hooks only
- TypeScript interfaces for all props and data types
- React.memo for expensive components
- Error boundaries around each widget
- Lazy loading with dynamic imports for performance

### State Management Patterns
- **React Context**: Global theme state (dark/light mode)
- **Zustand**: Dashboard layout state (widget positions, sizes, visibility)
- **React Query**: Server state with automatic caching and refetching
- **localStorage**: Persist user preferences and layout configuration

### Styling & UI Conventions
- Tailwind utility classes for all styling
- Shadcn/ui components for consistent design system
- Mobile-first responsive design (640px, 768px, 1024px, 1280px breakpoints)
- Framer Motion for smooth animations and transitions
- Lucide React for consistent iconography

```typescript
// Responsive Widget Pattern (Mobile-First)
<div className="
  w-full 
  h-48 sm:h-64 md:h-72 lg:h-80
  p-4 sm:p-6
  bg-white dark:bg-gray-800
  rounded-lg shadow-md border border-gray-200 dark:border-gray-700
  transition-all duration-200
  hover:shadow-lg hover:scale-[1.02]
">

// Grid Layout Pattern (from PRD)
<div className="
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
  gap-4 sm:gap-6
  p-4 sm:p-6 lg:p-8
  min-h-screen bg-gray-50 dark:bg-gray-900
">

// Dashboard Store Pattern
export const useDashboardStore = create<DashboardState>((set, get) => ({
  widgets: defaultWidgets,
  layout: loadLayoutFromStorage(),
  updateWidgetPosition: (widgetId: string, position: Position) => {
    set((state) => ({
      layout: { ...state.layout, [widgetId]: position }
    }));
    saveLayoutToStorage(get().layout);
  }
}));
```

## Key Directories (Planned Structure)
```
src/
├── components/
│   ├── layout/           # DashboardGrid, Sidebar, Header, Footer
│   ├── widgets/          # WeatherWidget, GitHubWidget, CryptoWidget, NewsWidget
│   │   └── BaseWidget.tsx    # Wrapper providing consistent UI/error handling
│   ├── ui/               # Shadcn/ui components (button, card, dialog, etc.)
│   └── shared/           # LoadingSpinner, ErrorBoundary, SkeletonLoader
├── hooks/                # useWeather, useGitHub, useCrypto, useNews, useLocalStorage
├── services/api/         # weather.ts, github.ts, crypto.ts, news.ts
├── store/               # dashboardStore.ts (Zustand), themeStore.ts (Context)
├── types/               # widget.types.ts, api.types.ts, dashboard.types.ts
├── utils/               # formatters.ts, validators.ts, constants.ts
├── App.tsx              # Currently: Basic counter component
└── main.tsx             # React 19 entry point
```

## Critical Integration Points
- **API Keys**: Store in environment variables (VITE_WEATHER_API_KEY, VITE_NEWS_API_KEY, etc.)
- **Rate Limiting**: Implement caching strategies and fallback mechanisms
- **Drag & Drop**: Use dnd-kit or react-grid-layout for widget repositioning
- **Data Visualization**: Recharts for crypto price trends and data charts
- **Error Handling**: Try-catch blocks, retry mechanisms with exponential backoff
- **Performance**: Code splitting, lazy loading, React.memo, bundle size < 300KB

## Testing Strategy
- **Component Testing**: React Testing Library for widget interactions
- **API Testing**: Mock API responses with MSW (Mock Service Worker)
- **Error Boundary Testing**: Verify graceful failure handling
- **Performance Testing**: Lighthouse scores (90+ all categories)
- **Accessibility Testing**: ARIA labels, keyboard navigation, screen readers

## Deployment & Environment
```bash
# Environment variables (.env.local)
VITE_WEATHER_API_KEY=your_openweathermap_key
VITE_NEWS_API_KEY=your_newsapi_key
VITE_GITHUB_TOKEN=your_github_token_optional

# Currently Installed Dependencies
npm install react@19.1.1 react-dom@19.1.1   # Already installed
npm install -D typescript@5.8.3 vite@7.1.7    # Already installed

# Planned Dependencies (Not Yet Installed)
npm install @tanstack/react-query zustand framer-motion
npm install recharts lucide-react @dnd-kit/core
npm install axios clsx tailwind-merge
npm install -D @types/node tailwindcss postcss autoprefixer

# Deployment (Vercel recommended)
npm run build
# Deploy to Vercel/Netlify with environment variables configured
# Vercel deployment: vercel --prod
```

## Common Widget Implementation Patterns
```typescript
// Error Boundary Pattern
<ErrorBoundary fallback={<WidgetError onRetry={refetch} />}>
  <Suspense fallback={<WidgetSkeleton />}>
    <LazyWidget />
  </Suspense>
</ErrorBoundary>

// Data Transformation Pattern
const transformCryptoData = (rawData: CoinGeckoResponse): CryptoData[] => 
  rawData.map(coin => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    price: formatCurrency(coin.current_price),
    change24h: formatPercentage(coin.price_change_percentage_24h)
  }));
```

## Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle size: < 300KB (gzipped)
- Lighthouse score: 90+ across all categories

## Documentation & Knowledge Management

### AI Session Documentation
**CRITICAL**: Maintain a markdown file for every significant AI prompt and response session to preserve development knowledge and decisions.

#### Session Documentation Template
```markdown
# Session: [Date] - [Topic/Feature]

## Context
- What we're working on
- Current state of the project
- Specific goals for this session

## Prompts & Responses
### Prompt 1: [Brief description]
[Original prompt text]

**Response Summary**: [Key decisions/code generated]

## Outcomes
- Files created/modified
- Patterns established
- Decisions made
- Next steps identified

## Knowledge Gained
- New patterns discovered
- Best practices learned
- Gotchas/issues encountered
```

#### Quick Reference
- **Create session files**: For any conversation involving multiple prompts or significant feature development
- **Update copilot-instructions.md**: When new patterns or conventions are established
- **Document decisions**: Why certain approaches were chosen over alternatives

This ensures continuity between AI sessions and prevents re-solving the same problems.