# AI Tool Prompt: Interactive Data Dashboard Project

## Copy and paste this prompt when working with AI coding assistants:

---

I'm building an **Interactive Data Dashboard** web application. Here's the complete context:

### Project Overview
A customizable dashboard that displays real-time data from multiple APIs (weather, GitHub stats, cryptocurrency prices, news) with drag-and-drop widgets, theme switching, and responsive design.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: React Context (theme), Zustand (layout), React Query (API data)
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Drag & Drop**: dnd-kit or react-grid-layout

### Core Features (MVP)
1. **Dashboard Grid Layout** - Responsive, customizable widget arrangement
2. **Four Widget Types**: Weather, GitHub Stats, Crypto Prices, News Feed
3. **Customization**: Add/remove widgets, drag-and-drop repositioning, resize
4. **Theme Toggle**: Dark/light mode
5. **Data Refresh**: Manual refresh + configurable auto-refresh
6. **Local Storage**: Save user preferences and layout

### APIs to Integrate
- OpenWeatherMap API (weather)
- GitHub REST API (user/repo stats)
- CoinGecko API (crypto prices)
- NewsAPI (news articles)

### Project Structure
```
src/
├── components/
│   ├── layout/ (DashboardGrid, Sidebar, Header)
│   ├── widgets/ (WeatherWidget, GitHubWidget, CryptoWidget, NewsWidget)
│   ├── ui/ (shadcn components)
│   └── shared/ (LoadingSpinner, ErrorBoundary)
├── hooks/ (useWeather, useGitHub, useCrypto, useNews)
├── services/api/ (API integration logic)
├── store/ (Zustand stores)
├── types/ (TypeScript interfaces)
└── utils/ (helpers, formatters)
```

### Key Requirements
- **Responsive**: Mobile-first design with proper breakpoints
- **Performance**: Fast loading, smooth animations, optimized bundle
- **Error Handling**: Graceful failures with retry mechanisms
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Type Safety**: Full TypeScript coverage

### Development Phases
1. **Foundation**: Project setup, layout structure, theme system
2. **Core Widgets**: Weather and Crypto widgets with data fetching
3. **Advanced Features**: GitHub/News widgets, drag-and-drop
4. **Polish**: Animations, error handling, optimization

### Current Task
[Specify what you need help with, e.g.:]
- Setting up the initial project structure
- Creating the Weather widget component
- Implementing drag-and-drop functionality
- Setting up React Query for API calls
- [Your specific task here]

### Additional Context
[Add any specific requirements, challenges, or preferences]

### Code Style Preferences
- Functional components with hooks
- TypeScript interfaces for all data types
- Tailwind utility classes for styling
- Descriptive variable names
- Comments for complex logic
- Error boundaries around widgets

---

**Please help me with: [YOUR SPECIFIC TASK/QUESTION]**

## Quick Reference Examples:

### For setting up a widget:
"Create the WeatherWidget component that fetches data from OpenWeatherMap API, displays current temperature, conditions, and a 5-day forecast. Include loading and error states."

### For API integration:
"Set up the weather API service using axios with proper TypeScript types. Include error handling and response transformation. The API endpoint is api.openweathermap.org/data/2.5/weather"

### For layout implementation:
"Implement the DashboardGrid component using react-grid-layout. It should support drag-and-drop, resizing, and save the layout to localStorage. Make it responsive for mobile and desktop."

### For state management:
"Create a Zustand store for managing the dashboard layout, including widget positions, sizes, and which widgets are visible. Include actions for adding, removing, and rearranging widgets."

### For styling:
"Style the BaseWidget wrapper component using Tailwind CSS. Include a card design with shadow, rounded corners, a header with title and action buttons, and a content area. Support dark mode."