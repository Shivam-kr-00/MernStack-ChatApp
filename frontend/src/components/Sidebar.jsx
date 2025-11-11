import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Search, RefreshCcw } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = ({ isOpen, onClose }) => {
  const { getFriends, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const filteredUsers = users
    .filter((user) => !showOnlineOnly || onlineUsers.includes(user._id))
    .filter(
      (user) =>
        searchTerm === "" ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside
      className={`flex flex-col h-full border-r border-base-content/10 bg-gradient-radial from-base-200/50 to-base-300/50 dark:from-base-300/50 dark:to-base-100/50 backdrop-blur-md text-base-content rounded-r-2xl shadow-lg transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-4 flex flex-col border-b border-base-content/10">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-lg text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Friends
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-base-content/50" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 bg-base-content/10 dark:bg-base-200 border-base-content/20 text-base-content placeholder-base-content/50 focus:border-primary rounded-xl shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center mt-3 gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-primary"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
            />
            <span className="text-sm text-base-content">Show online only</span>
          </label>
          <button
            onClick={getFriends}
            className="ml-auto p-2 rounded-lg hover:bg-base-content/10 transition-colors"
          >
            <RefreshCcw size={16} className="text-base-content/70" />
          </button>
        </div>
      </div>

      {/* Friend List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                // ✅ Auto close on mobile after selection
                if (window.innerWidth < 1024) onClose();
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl mb-2 transition-all ${
                selectedUser?._id === user._id
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30"
                  : "hover:bg-base-content/5"
              }`}
            >
              <div className="relative">
                <img
                  src={
                    user.profilePic ||
                    "https://res.cloudinary.com/dahpi68b7/image/upload/v1761576531/avatar_boeayu.png"
                  }
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full border-2 border-base-content/20 shadow-md"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-200 dark:ring-base-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-base-content/70">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-base-content/50 py-8">
            {searchTerm
              ? "No friends found"
              : "No friends yet. Send a request!"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
