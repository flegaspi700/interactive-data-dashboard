# Dashboard Project - Quick Reference Guide

## 📦 Core Dependencies

### **React 19.1.1**
- **Purpose**: UI library for building component-based interfaces
- **Key Features**: 
  - Functional components with hooks
  - Virtual DOM for performance
  - Component lifecycle management
- **Usage**: `import { useState, useEffect } from 'react'`

### **TypeScript 5.8.3**
- **Purpose**: Type safety for JavaScript
- **Key Features**:
  - Catch errors at compile time
  - Better IDE support and autocomplete
  - Interface definitions for props/data
- **Usage**: `interface Props { title: string; }`

### **Vite 7.1.7**
- **Purpose**: Fast build tool and dev server
- **Key Features**:
  - Lightning-fast HMR (< 100ms)
  - ES modules in development
  - Optimized production builds
- **Commands**:
  - `npm run dev` - Start dev server
  - `npm run build` - Production build
  - `npm run preview` - Preview build

## 🎨 Styling & UI

### **Tailwind CSS 3.4.17**
- **Purpose**: Utility-first CSS framework
- **Key Features**:
  - Responsive design classes
  - Dark mode support (`dark:`)
  - Custom utilities and components
- **Setup**: 
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### **Lucide React 0.544.0** ✅ *Installed*
- **Purpose**: Beautiful icon library
- **Key Features**:
  - Tree-shakeable (only imports used icons)
  - Consistent design system
  - 1000+ icons available
- **Usage**: 
  ```tsx
  import { Sun, Moon, Settings, GripVertical } from 'lucide-react'
  <Sun className="w-5 h-5" />
  ```

### **@dnd-kit/core + @dnd-kit/sortable 6.1.0** ✅ *Installed*
- **Purpose**: Modern drag-and-drop library for React
- **Key Features**:
  - Accessibility-first design
  - Touch and keyboard support
  - Flexible and performant
  - TypeScript support
- **Usage**:
  ```tsx
  import { DndContext, useSortable } from '@dnd-kit/core'
  import { SortableContext } from '@dnd-kit/sortable'
  
  function handleDragEnd(event) {
    // Handle reordering logic
  }
  ```

## 📊 Data & State Management

### **@tanstack/react-query 5.90.2** ✅ *Installed*
- **Purpose**: Server state management and data fetching
- **Key Features**:
  - Automatic caching and background updates
  - Loading/error state management
  - Stale data refetching
  - Offline support
- **Usage**:
  ```tsx
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather', city],
    queryFn: () => fetchWeather(city),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
  ```

### **Axios 1.12.2** ✅ *Installed*
- **Purpose**: HTTP client for API requests
- **Key Features**:
  - Better than fetch API
  - Automatic JSON parsing
  - Request/response interceptors
  - Better error handling
- **Usage**:
  ```tsx
  const response = await axios.get('/api/weather', {
    params: { city: 'London' },
    timeout: 5000
  })
  ```

## 📈 Data Visualization

### **Recharts 3.2.1** ✅ *Installed*
- **Purpose**: React components for charts and graphs
- **Key Features**:
  - Line charts, bar charts, pie charts
  - Responsive and customizable
  - Built specifically for React
  - Animation support
- **Usage**:
  ```tsx
  import { LineChart, Line, XAxis, YAxis } from 'recharts'
  <LineChart data={chartData}>
    <Line dataKey="price" stroke="#8884d8" />
  </LineChart>
  ```

## 🔧 Development Tools

### **ESLint 9.36.0**
- **Purpose**: Code linting and quality enforcement
- **Key Features**:
  - React-specific rules
  - TypeScript integration
  - Auto-fixable issues
- **Command**: `npm run lint`

### **PostCSS 8.5.6 + Autoprefixer 10.4.21**
- **Purpose**: CSS processing and vendor prefixes
- **Key Features**:
  - Automatically adds browser prefixes
  - CSS optimization
  - Tailwind CSS processing
- **Config**: `postcss.config.js`

## 🌐 API Endpoints

### **Weather API (OpenWeatherMap)**
- **Endpoint**: `api.openweathermap.org/data/2.5/weather`
- **Rate Limit**: 60 calls/minute
- **Env Var**: `VITE_WEATHER_API_KEY`

### **Crypto API (CoinGecko)**
- **Endpoint**: `api.coingecko.com/api/v3/coins/markets`
- **Rate Limit**: 10-50 calls/minute
- **No API Key**: Required for higher limits

### **GitHub API**
- **Endpoint**: `api.github.com/users/{username}`
- **Rate Limit**: 60 calls/hour (unauthenticated)
- **Env Var**: `VITE_GITHUB_TOKEN` (optional, increases limit)

### **News API**
- **Endpoint**: `newsapi.org/v2/top-headlines`
- **Rate Limit**: 100 requests/day (free tier)
- **Env Var**: `VITE_NEWS_API_KEY`

### **Quotable API (No Key Required)**
- **Endpoint**: `api.quotable.io/quotes`
- **Rate Limit**: No strict limits
- **Features**: Random quotes, categories, daily quotes
- **No API Key**: Free public API

## 📜 Common Commands

### **Development**
```bash
npm run dev          # Start development server (localhost:5173)
npm run build        # Create production build
npm run preview      # Preview production build
npm run lint         # Run ESLint checks
```

### **Package Management**
```bash
npm install <package>           # Install new dependency
npm install -D <package>        # Install dev dependency
npm update                      # Update all packages
npm outdated                    # Check for outdated packages
```

### **Git Workflow**
```bash
git add .                       # Stage all changes
git commit -m "message"         # Commit with message
git push                        # Push to remote
git pull                        # Pull latest changes
```

## 🗂️ Project Structure

```
src/
├── components/
│   ├── layout/          # Header, DashboardGrid, DraggableWidget ✅
│   └── widgets/         # Weather, News, GitHub, Crypto, Quotes ✅
├── hooks/               # useTheme, useWeather, useCrypto, etc. ✅
├── services/api/        # weather.ts, crypto.ts, github.ts, etc. ✅
├── store/               # dashboardStore.ts (edit mode state) ✅
├── types/               # widget.types.ts ✅
├── App.tsx              # Widget ordering + drag-and-drop ✅
└── main.tsx             # React entry point ✅
```

## 🎯 Quick Tips

### **Dashboard Features**
- Enter edit mode to drag and drop widgets
- Widget order auto-saves to localStorage
- Weather widget shows current location or city
- All widgets refresh automatically with React Query

### **React Hooks Rules**
- Always call hooks at the top level
- Never call hooks in loops or conditions
- Custom hooks must start with `use`

### **Drag & Drop (@dnd-kit)**
- Wrap draggable items in `<DraggableWidget>`
- Use `useSortable()` for sortable behavior
- Implement `handleDragEnd()` for reordering logic

### **Tailwind CSS**
- Use `dark:` prefix for dark mode styles
- Mobile-first responsive design (`sm:`, `md:`, `lg:`, `xl:`)
- Prefer utility classes over custom CSS

### **TypeScript**
- Use `interface` for object shapes
- Use `type` for unions and primitives
- Import types with `import type { ... }`

### **Performance**
- React Query handles API caching automatically
- localStorage persists user preferences
- Use `React.memo()` for expensive components

## 🔍 Debugging

### **React Developer Tools**
- Install browser extension
- Inspect component props and state
- Profile component performance

### **Console Commands**
```javascript
console.log()           // Basic logging
console.error()         // Error messages
console.table()         // Display arrays/objects as table
console.time()          // Performance timing
```

### **Network Issues**
- Check browser Network tab
- Verify API endpoints and keys
- Check CORS settings
- Monitor rate limits

---

*Last Updated: October 1, 2025*  
*Project: Interactive Data Dashboard*