import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, User, MessageSquare, MoreVertical } from 'lucide-react';
import SettingsPanel from './SettingsPanel';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-base-200/50 backdrop-blur-md border-b border-white/10">
        <div className="navbar w-full px-4 flex justify-between items-center">

            {/* Logo and Brand */}
            <div className="navbar-start ml-7">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold text-base-content">
                  Chatty
                </span>
              </Link>
            </div>

            {/* User Menu - Right */}
            <div className="navbar-end">
              {authUser ? (
                <div className="flex items-center gap-4 ml-4">
                  {/* User Profile */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleProfileClick}
                      className="group relative"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-base-content/20 overflow-hidden transition-transform duration-200 group-hover:scale-105">
                        <img
                          src={authUser.profilePic || "/avatar.png"}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <User className="text-white" size={20} />
                      </div>
                    </button>
                    <span className="hidden lg:block font-medium text-base-content">
                      {authUser.fullName}
                    </span>
                  </div>

                  {/* Three Dot Menu */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="p-2 hover:bg-base-content/10 rounded-lg transition-colors"
                    >
                      <MoreVertical className="text-base-content" size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-base-200/90 backdrop-blur-md rounded-lg shadow-lg border border-base-content/10 py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-base-content/10 transition-colors text-base-content"
                          onClick={() => setShowDropdown(false)}
                        >
                          <User size={18} />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            setShowSettings(true);
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-base-content/10 transition-colors w-full text-left text-base-content"
                        >
                          <Settings size={18} />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-base-content/10 transition-colors w-full text-left text-red-400"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="btn btn-ghost btn-sm text-base-content hover:bg-base-content/10"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-primary btn-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default Navbar;
