import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Users, Search, RefreshCcw } from "lucide-react";
import { useAuthStore } from '../store/useAuthStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log("📦 Fetching users...");
    getUsers();
  }, [getUsers]);

  // Filter users based on online status and search term
  const filteredUsers = users
    .filter(user => !showOnlineOnly || onlineUsers.includes(user._id))
    .filter(user => 
      searchTerm === '' || 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  useEffect(() => {
    console.log("👥 Users from store:", users);
    console.log("🎯 Selected user:", selectedUser);
  }, [users, selectedUser]);

  if (isUsersLoading) {
    console.log("⏳ Loading users...");
    return <SidebarSkeleton />;
  }

  return (
    <aside className='flex flex-col h-full border-r border-base-content/10 bg-base-200/50 backdrop-blur-md text-base-content'>
      {/* Fixed Header */}
      <div className='p-4 flex flex-col border-b border-base-content/10'>
        {/* Title */}
        <div className='flex justify-between items-center mb-4'>
          <span className='font-medium text-lg text-base-content'>Contacts</span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-base-content/50" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 bg-base-content/10 border-base-content/20 text-base-content placeholder-base-content/50 focus:border-primary rounded-md"
          />
        </div>

        {/* Online filter toggle */}
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
          <button onClick={() => {
            console.log("🔄 Refetching users...");
            getUsers();
          }} className="ml-auto">
            <span className="text-xs text-base-content/50">
              <RefreshCcw size={14} className="inline" /> Refresh
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable User List */}
      <div className='flex-1 overflow-y-auto custom-scrollbar p-2'>
        {isUsersLoading ? (
          <div className='flex justify-center items-center h-full'>
            <div className='loading loading-spinner text-primary'></div>
          </div>
        ) : filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`flex items-center gap-2 p-3 cursor-pointer rounded-lg mb-1 ${selectedUser?._id === user._id ? 'bg-base-content/10' : 'hover:bg-base-content/5'}`}
              onClick={() => {
                console.log("🖱️ User clicked:", user);
                setSelectedUser(user);
              }}
            >
              <div className='relative'>
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className='size-12 object-cover rounded-full border-2 border-base-content/20'
                />
                {onlineUsers.includes(user._id) && (
                  <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-200' />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='font-medium truncate text-base-content'>{user.fullName}</div>
                <div className='text-sm text-base-content/70'>
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center text-base-content/50 py-8'>
            {searchTerm ? 'No users found' : 'No users yet'}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
