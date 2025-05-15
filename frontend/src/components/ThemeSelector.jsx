import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { THEMES } from '../constants';

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  // Update button implementation to not use ThemeController
  // Organize themes into categories for better UI
  const popularThemes = ["light", "dark", "coffee", "cupcake", "synthwave", "dracula", "night"];
  const otherThemes = THEMES.filter(t => !popularThemes.includes(t));

  // Direct theme setting function
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="theme-selector">
      <h3 className="text-lg font-medium mb-3 text-base-content">Theme</h3>
      
      <div className="mb-4">
        <h4 className="text-sm text-base-content/70 mb-2">Popular</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {popularThemes.map((themeName) => (
            <button
              key={themeName}
              onClick={() => handleThemeChange(themeName)}
              className={`px-3 py-2 rounded capitalize text-sm ${
                theme === themeName
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-200 hover:bg-base-300 text-base-content'
              }`}
            >
              {themeName}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm text-base-content/70 mb-2">All Themes</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto thin-scrollbar pr-1">
          {otherThemes.map((themeName) => (
            <button
              key={themeName}
              onClick={() => handleThemeChange(themeName)}
              className={`px-3 py-2 rounded capitalize text-sm ${
                theme === themeName
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-200 hover:bg-base-300 text-base-content'
              }`}
            >
              {themeName}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-base-200 rounded-lg">
        <p className="text-sm text-base-content/80">
          Current theme: <span className="font-semibold capitalize">{theme}</span>
        </p>
      </div>
    </div>
  );
};

export default ThemeSelector; 