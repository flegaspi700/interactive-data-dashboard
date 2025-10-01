import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

// 📚 Define what our theme can be
type Theme = 'light' | 'dark';

// 📚 Define the shape of our context value
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// 📚 Create the context with undefined as initial value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 📚 Provider component that wraps our app
export function ThemeProvider({ children }: { children: ReactNode }) {
  // 📚 State: Check localStorage or system preference for initial theme
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) return saved;
    
    // Checks user's system preference
    // Returns 'dark' if user prefers dark mode, otherwise 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });

  // 📚 Effect: Update <html> class and localStorage when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Stores data in browser that persists between visits
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 📚 Function to toggle between light and dark
  // Alternative: sessionStorage (clears when browser closes)
  // Alternative: Cookies (can expire, sent to server)
  // localStorage is perfect for UI preferences
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 📚 Custom hook to use theme in any component
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}