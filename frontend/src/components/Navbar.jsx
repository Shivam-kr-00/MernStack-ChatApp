import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import {
  Settings,
  LogOut,
  User,
  MessageSquare,
  MoreVertical,
  UserPlus,
  Bell,
} from "lucide-react";
import SettingsPanel from "./SettingsPanel";
import FindFriends from "./FindFriends";
import FriendRequests from "./FriendRequests";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFindFriends, setShowFindFriends] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => navigate("/profile");

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-base-200/50 to-base-300/50 dark:from-base-300/50 dark:to-base-100/50 backdrop-blur-md border-b border-white/10">
        <div className="navbar w-full px-3 sm:px-6 flex justify-between items-center">
          {/* 🔹 Brand Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <MessageSquare
              className="text-orange-500 flex-shrink-0"
              size={22}
            />
            <Link
              to="/"
              className="font-bold text-xl sm:text-2xl bg-gradient-to-br from-orange-600 to-green-600 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
            >
              FeelTalk
            </Link>
          </div>

          {/* 🔹 Right Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {authUser ? (
              <>
                {/* Find Friends */}
                <button
                  onClick={() => setShowFindFriends(true)}
                  className="p-2 hover:bg-base-content/10 rounded-lg transition-all hover:scale-105 sm:hover:scale-110"
                  title="Find Friends"
                >
                  <UserPlus className="text-base-content" size={18} />
                </button>

                {/* Friend Requests */}
                <button
                  onClick={() => setShowRequests(true)}
                  className="p-2 hover:bg-base-content/10 rounded-lg transition-all hover:scale-105 sm:hover:scale-110"
                  title="Friend Requests"
                >
                  <Bell className="text-base-content animate-pulse" size={18} />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={handleProfileClick}
                    className="group relative bg-gradient-to-br from-blue-500 to-purple-500 p-0.5 rounded-full hover:scale-105 transition-all"
                    aria-label="Go to profile"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-base-100">
                      <img
                        src={
                          authUser.profilePic ||
                          "https://res.cloudinary.com/dahpi68b7/image/upload/v1761576531/avatar_boeayu.png"
                        }
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <User className="text-white" size={18} />
                    </div>
                  </button>
                  <span className="hidden md:block font-medium text-base-content truncate max-w-[100px]">
                    {authUser.fullName}
                  </span>
                </div>

                {/* Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 hover:bg-base-content/10 rounded-lg hover:scale-105 transition-all"
                    aria-label="More options"
                  >
                    <MoreVertical className="text-base-content" size={18} />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-44 sm:w-48 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg py-2 animate-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 rounded-lg transition-colors text-base-content"
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          setShowSettings(true);
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 rounded-lg text-base-content"
                      >
                        <Settings size={18} />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 text-red-400 rounded-lg"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm text-base-content hover:bg-base-content/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm hover:scale-105 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      {showSettings && (
        <div className="animate-in zoom-in-95 duration-200">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </div>
      )}
      {showFindFriends && (
        <div className="animate-in zoom-in-95 duration-200">
          <FindFriends onClose={() => setShowFindFriends(false)} />
        </div>
      )}
      {showRequests && (
        <div className="animate-in zoom-in-95 duration-200">
          <FriendRequests
            isOpen={showRequests}
            onClose={() => setShowRequests(false)}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
