import React from 'react';
import { Moon, Sun, Edit3, Save, RotateCcw } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useDashboardStore } from '../../store/dashboardStore';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isEditMode, setEditMode, resetLayout } = useDashboardStore();

  const handleEditToggle = () => {
    setEditMode(!isEditMode);
  };

  const handleResetLayout = () => {
    if (confirm('Are you sure you want to reset the layout? This will restore all widgets to their default positions.')) {
      resetLayout();
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Interactive Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Edit Mode Toggle */}
            <button
              onClick={handleEditToggle}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isEditMode 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
              aria-label={isEditMode ? 'Exit edit mode' : 'Enter edit mode'}
            >
              {isEditMode ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              {isEditMode ? 'Save Layout' : 'Edit Layout'}
            </button>

            {/* Reset Layout Button - only show in edit mode */}
            {isEditMode && (
              <button
                onClick={handleResetLayout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                aria-label="Reset layout"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
