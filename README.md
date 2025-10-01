# Interactive Data Dashboard# React + TypeScript + Vite



A modern, customizable dashboard built with React 19 + TypeScript + Vite, featuring real-time data from multiple APIs with drag-and-drop widget reordering.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



![Dashboard Preview](https://img.shields.io/badge/Status-Fully%20Functional-brightgreen)Currently, two official plugins are available:

![React](https://img.shields.io/badge/React-19.1.1-blue)

![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



## ✨ Features## React Compiler



- 🌟 **6 Interactive Widgets**: Weather, News, GitHub Stats, Cryptocurrency, Inspirational Quotes, and PlaceholderThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- 🎯 **Drag & Drop**: Customize your layout by dragging widgets to reorder them

- 💾 **Layout Persistence**: Your widget arrangement is automatically saved## Expanding the ESLint configuration

- 🌙 **Dark/Light Theme**: Beautiful theme switching with system preference detection

- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktopIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- ⚡ **Real-time Data**: Auto-refreshing data with smart caching strategies

- 🔄 **Modern Architecture**: React Query for API state, TypeScript for safety```js

export default defineConfig([

## 🚀 Live Demo  globalIgnores(['dist']),

  {

```bash    files: ['**/*.{ts,tsx}'],

npm run dev    extends: [

```      // Other configs...



Visit `http://localhost:5173` to see the dashboard in action!      // Remove tseslint.configs.recommended and replace with this

      tseslint.configs.recommendedTypeChecked,

## 📊 Widgets Overview      // Alternatively, use this for stricter rules

      tseslint.configs.strictTypeChecked,

### 🌤️ Weather Widget      // Optionally, add this for stylistic rules

- Current weather conditions with temperature, humidity, wind      tseslint.configs.stylisticTypeChecked,

- 5-day forecast display

- Automatic location detection with city fallback      // Other configs...

- Real-time clock display    ],

    languageOptions: {

### 📰 News Widget        parserOptions: {

- Latest technology news headlines        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- Article previews with direct links        tsconfigRootDir: import.meta.dirname,

- Category filtering capabilities      },

- Auto-refresh every 10 minutes      // other options...

    },

### 🐙 GitHub Widget  },

- User profile and statistics])

- Repository listings with stars/forks```

- Contribution activity overview

- Real-time GitHub API integrationYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:



### 💰 Crypto Widget```js

- Real-time cryptocurrency prices// eslint.config.js

- 24-hour price change indicatorsimport reactX from 'eslint-plugin-react-x'

- Market cap informationimport reactDom from 'eslint-plugin-react-dom'

- Top 6 cryptocurrencies display

export default defineConfig([

### 💡 Quotes Widget  globalIgnores(['dist']),

- Daily inspirational quotes  {

- Category-based quote filtering    files: ['**/*.{ts,tsx}'],

- Beautiful gradient design    extends: [

- Motivational content refresh      // Other configs...

      // Enable lint rules for React

### 📦 Placeholder Widget      reactX.configs['recommended-typescript'],

- Template for future widget development      // Enable lint rules for React DOM

- Color-coded design system      reactDom.configs.recommended,

- Grid structure reference    ],

    languageOptions: {

## 🛠️ Technology Stack      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

### Core Framework        tsconfigRootDir: import.meta.dirname,

- **React 19.1.1** - Latest React with modern hooks      },

- **TypeScript 5.8.3** - Type safety and better DX      // other options...

- **Vite 7.1.7** - Lightning-fast build tool and dev server    },

  },

### Styling & UI])

- **Tailwind CSS 3.4.17** - Utility-first CSS framework```

- **Lucide React** - Beautiful, consistent icon library

### State Management & Data
- **@tanstack/react-query** - Server state management and caching
- **Axios** - HTTP client for API requests
- **React Context** - Theme state management
- **localStorage** - Widget layout persistence

### Drag & Drop
- **@dnd-kit/core** - Modern, accessible drag-and-drop
- **@dnd-kit/sortable** - Sortable widget functionality

### Development Tools
- **ESLint 9.36.0** - Code linting and quality
- **PostCSS + Autoprefixer** - CSS processing
- **TypeScript Config** - Strict type checking

## 🔌 API Integrations

- **OpenWeatherMap API** - Weather data (60 calls/min)
- **NewsAPI** - Technology news (100 calls/day)
- **GitHub REST API** - User and repository data (60 calls/hr)
- **CoinGecko API** - Cryptocurrency prices (no key required)
- **Quotable API** - Inspirational quotes (no key required)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API keys for external services (optional, some widgets work without keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/interactive-data-dashboard.git
   cd interactive-data-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   # Create .env.local file
   VITE_WEATHER_API_KEY=your_openweathermap_key
   VITE_NEWS_API_KEY=your_newsapi_key
   VITE_GITHUB_TOKEN=your_github_token_optional
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Header, DashboardGrid, DraggableWidget
│   └── widgets/         # All 6 widget implementations
├── hooks/               # Custom React hooks (useTheme, useWeather, etc.)
├── services/api/        # API integration functions
├── store/               # State management (edit mode state)
├── types/               # TypeScript interface definitions
├── App.tsx              # Main app with widget ordering
└── main.tsx             # React entry point
```

## 🎨 Customization

### Adding New Widgets
1. Create a new widget component in `src/components/widgets/`
2. Add the widget to the `widgets` object in `App.tsx`
3. Update the `widgetOrder` state to include your new widget

### Theming
The app uses Tailwind CSS with a comprehensive dark/light theme system. Customize colors in `tailwind.config.js`.

### API Configuration
All API services are in `src/services/api/`. Add new APIs by creating a new service file and corresponding React Query hook.

## 🔧 Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally  
- `npm run lint` - Run ESLint for code quality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap** for weather data
- **NewsAPI** for news headlines
- **GitHub** for user/repo statistics
- **CoinGecko** for cryptocurrency data
- **Quotable** for inspirational quotes
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first approach

---

⭐ **If you found this project helpful, please consider giving it a star!** ⭐