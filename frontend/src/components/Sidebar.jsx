// components/Sidebar.jsx (enhanced)
import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Users, Search, RefreshCcw } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = ({ isOpen, onClose }) => {
  // Updated: Use getFriends instead of getUsers
  const { getFriends, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("📦 Fetching friends...");
    getFriends(); // Updated: Call getFriends
  }, [getFriends]);

  // Filter friends based on online status and search term (same logic)
  const filteredUsers = users
    .filter((user) => !showOnlineOnly || onlineUsers.includes(user._id))
    .filter(
      (user) =>
        searchTerm === "" ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  useEffect(() => {
    console.log("👥 Friends from store:", users);
    console.log("🎯 Selected friend:", selectedUser);
  }, [users, selectedUser]);

  if (isUsersLoading) {
    console.log("⏳ Loading friends...");
    return <SidebarSkeleton />;
  }

  // Shared content for both mobile and desktop - Enhanced with gradients and animations
  const sidebarContent = (
    <>
      {/* Custom CSS for animations */}
      <style jsx>{`
        .sidebar-fade-in {
          animation: sidebarFadeIn 0.6s ease-out;
        }
        @keyframes sidebarFadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .friend-slide-in {
          animation: friendSlideIn 0.4s ease-out forwards;
          opacity: 0;
        }
        @keyframes friendSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .friend-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease,
            background 0.3s ease;
        }
        .friend-hover:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.1),
            rgba(147, 51, 234, 0.1)
          );
        }
        .avatar-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .avatar-hover:hover {
          transform: scale(1.1);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        .input-glow:focus {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
        }
        .refresh-rotate {
          transition: transform 0.3s ease;
        }
        .refresh-rotate:active {
          transform: rotate(180deg);
        }
        .pulse-online {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .glassmorphism {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>

      {/* Fixed Header - Enhanced with Gradient and Glassmorphism */}
      <div className="p-4 flex flex-col border-b border-base-content/10 glassmorphism rounded-t-lg">
        {/* Updated: Title to "Friends" */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Friends
          </span>
        </div>

        {/* Search Bar - Added Glow on Focus */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-base-content/50" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 bg-base-content/10 dark:bg-base-200 border-base-content/20 text-base-content placeholder-base-content/50 focus:border-primary rounded-xl shadow-sm input-glow transition-all duration-300"
            aria-label="Search friends"
          />
        </div>

        {/* Online filter toggle - Enhanced with Gradient Accent */}
        <div className="flex items-center mt-3 gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-primary bg-gradient-to-r from-primary to-secondary"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              aria-label="Show online friends only"
            />
            <span className="text-sm text-base-content">Show online only</span>
          </label>
          <button
            onClick={() => {
              console.log("🔄 Refetching friends...");
              getFriends(); // Updated: Call getFriends
            }}
            className="ml-auto p-2 rounded-lg hover:bg-base-content/10 transition-colors refresh-rotate"
            aria-label="Refresh friends list"
          >
            <RefreshCcw size={16} className="text-base-content/70" />
          </button>
        </div>
      </div>

      {/* Scrollable Friend List - Added Staggered Animations and Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {isUsersLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loading loading-spinner text-primary"></div>
          </div>
        ) : filteredUsers?.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div
              key={user._id}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl mb-2 friend-hover friend-slide-in ${
                selectedUser?._id === user._id
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 shadow-lg border border-primary/30"
                  : "hover:bg-base-content/5 dark:hover:bg-base-300/20"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }} // Staggered slide-in
              onClick={() => {
                console.log("🖱️ Friend clicked:", user);
                setSelectedUser(user);
                if (isOpen) onClose(); // Close on mobile after selection
              }}
              role="button"
              tabIndex={0}
              aria-label={`Select friend: ${user.fullName}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedUser(user);
                  if (isOpen) onClose();
                }
              }}
            >
              <div className="relative">
                <img
                  src={
                    user.profilePic ||
                    "https://res.cloudinary.com/dahpi68b7/image/upload/v1761576531/avatar_boeayu.png"
                  }
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full border-2 border-base-content/20 shadow-md avatar-hover"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-200 dark:ring-base-300 pulse-online" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate text-base-content">
                  {user.fullName}
                </div>
                <div className="text-sm text-base-content/70">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-base-content/50 py-8 animate-fadeIn">
            {searchTerm
              ? "No friends found"
              : "No friends yet. Send a request!"}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay and Sidebar - Enhanced with Smooth Transitions and Backdrop Blur */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden transition-opacity duration-300 backdrop-blur-sm"
            onClick={onClose} // Closes on backdrop click
            aria-hidden="true"
          ></div>
          <aside className="fixed left-0 top-0 h-full w-3/4 max-w-sm bg-gradient-radial from-base-200/90 to-base-300/90 dark:from-base-300/90 dark:to-base-100/90 backdrop-blur-md z-50 lg:hidden flex flex-col text-base-content rounded-r-2xl shadow-2xl sidebar-fade-in">
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Desktop Sidebar - Enhanced with Gradient and Fade-In */}
      <aside className="hidden lg:flex lg:flex-col h-full border-r border-base-content/10 bg-gradient-radial from-base-200/50 to-base-300/50 dark:from-base-300/50 dark:to-base-100/50 backdrop-blur-md text-base-content rounded-r-2xl shadow-lg sidebar-fade-in">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
