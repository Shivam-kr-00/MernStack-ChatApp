import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "light",
  setTheme: (theme) => {
    // Only allow light or dark themes
    if (theme !== 'light' && theme !== 'dark') {
      theme = 'light';
    }
    
    // Save to local storage
    localStorage.setItem("chat-theme", theme);
    
    // Update the state
    set({ theme });
    
    // Apply theme to HTML element directly
    document.documentElement.setAttribute('data-theme', theme);
  },
}));
