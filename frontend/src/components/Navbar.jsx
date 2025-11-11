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
    navigate("/profile");
  };

  return (
    <>
      {/* Custom CSS for animations */}
      <style jsx>{`
        .navbar-fade-in {
          animation: navbarFadeIn 0.6s ease-out;
        }
        @keyframes navbarFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dropdown-slide {
          animation: dropdownSlide 0.3s ease-out;
        }
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hover-scale {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
        }
        .hover-glow {
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .hover-glow:hover {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
          transform: scale(1.1);
        }
        .pulse-notification {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .glassmorphism {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .gradient-text {
          background: linear-gradient(
            135deg,
            #ea580c,
            #16a34a
          ); /* Orange to Green */
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .avatar-gradient {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          padding: 2px;
          border-radius: 50%;
        }
        .modal-fade {
          animation: modalFade 0.4s ease-out;
        }
        @keyframes modalFade {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 navbar-fade-in">
        <div className="bg-gradient-to-r from-base-200/50 to-base-300/50 dark:from-base-300/50 dark:to-base-100/50 backdrop-blur-md border-b border-white/10 glassmorphism">
          <div className="navbar w-full px-4 flex justify-between items-center">
            {/* Logo and Brand - Enhanced with Gradient Text */}
            <div className="navbar-start ml-7">
              <Link to="/" className="flex items-center gap-2 hover-scale">
                <MessageSquare className="text-orange-500" size={24} />
                <span className="text-2xl font-bold gradient-text tracking-wide">
                  FeelTalk
                </span>
              </Link>
            </div>

            {/* User Menu - Right */}
            <div className="navbar-end">
              {authUser ? (
                <div className="flex items-center gap-4 ml-4">
                  {/* 🔍 Find Friends - Added Hover Glow */}
                  <button
                    onClick={() => setShowFindFriends(true)}
                    className="p-2 hover:bg-base-content/10 rounded-lg transition-colors hover-glow"
                    title="Find Friends"
                    aria-label="Find friends"
                  >
                    <UserPlus className="text-base-content" size={20} />
                  </button>

                  {/* 📨 Friend Requests - Added Pulse for Notifications */}
                  <button
                    onClick={() => setShowRequests(true)}
                    className="p-2 hover:bg-base-content/10 rounded-lg transition-colors hover-glow pulse-notification"
                    title="Friend Requests"
                    aria-label="View friend requests"
                  >
                    <Bell className="text-base-content" size={20} />
                  </button>

                  {/* User Profile - Enhanced with Gradient Border and Hover */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleProfileClick}
                      className="group relative avatar-gradient hover-scale"
                      aria-label="Go to profile"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-base-100">
                        <img
                          src={
                            authUser.profilePic ||
                            "https://res.cloudinary.com/dahpi68b7/image/upload/v1761576531/avatar_boeayu.png"
                          }
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

                  {/* Three Dot Menu - Enhanced Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="p-2 hover:bg-base-content/10 rounded-lg transition-colors hover-scale"
                      aria-label="More options"
                    >
                      <MoreVertical className="text-base-content" size={20} />
                    </button>

                    {/* Dropdown Menu - Added Slide Animation and Glassmorphism */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 glassmorphism rounded-xl shadow-lg border border-base-content/10 py-2 dropdown-slide">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 transition-colors text-base-content rounded-lg mx-1"
                          onClick={() => setShowDropdown(false)}
                          aria-label="Go to profile"
                        >
                          <User size={18} />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            setShowSettings(true);
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 transition-colors w-full text-left text-base-content rounded-lg mx-1"
                          aria-label="Open settings"
                        >
                          <Settings size={18} />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 transition-colors w-full text-left text-red-400 rounded-lg mx-1"
                          aria-label="Logout"
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
                    className="btn btn-ghost btn-sm text-base-content hover:bg-base-content/10 hover-scale"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-primary btn-sm hover-glow"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel - Added Fade Animation */}
      {showSettings && (
        <div className="modal-fade">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </div>
      )}

      {/* 🧑‍🤝‍🧑 Find Friends Modal - Added Fade Animation */}
      {showFindFriends && (
        <div className="modal-fade">
          <FindFriends onClose={() => setShowFindFriends(false)} />
        </div>
      )}

      {/* 📨 Friend Requests Modal - Added Fade Animation */}
      {showRequests && (
        <div className="modal-fade">
          <FriendRequests onClose={() => setShowRequests(false)} />
        </div>
      )}
    </>
  );
};

export default Navbar;
