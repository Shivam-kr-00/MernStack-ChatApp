import React, { useRef, useEffect } from 'react';
import { FiLogOut, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

const SettingsPanel = ({ onClose }) => {
  const { logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const panelRef = useRef();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose(); // Close if click is outside panel
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30">
      <div
        ref={panelRef}
        className="absolute top-0 right-0 h-full w-full lg:w-1/3 bg-base-100 shadow-lg p-4 overflow-y-auto thin-scrollbar"
      >
        <div className="flex justify-between items-center border-b border-base-content/10 pb-2 mb-4">
          <h2 className="text-xl font-semibold text-base-content">Settings</h2>
          <button onClick={onClose} className="text-2xl text-base-content"><FiX /></button>
        </div>

        {/* Theme Toggle Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-base-content">Appearance</h3>
          
          <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
            <div className="flex items-center gap-2">
              {theme === 'light' ? (
                <FiSun className="size-5 text-yellow-500" />
              ) : (
                <FiMoon className="size-5 text-blue-400" />
              )}
              <span className="font-medium text-base-content">{theme === 'light' ? 'Light' : 'Dark'} Theme</span>
            </div>
            
            <div className="form-control">
              <label className="cursor-pointer label">
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-base-content/10 pt-4">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
