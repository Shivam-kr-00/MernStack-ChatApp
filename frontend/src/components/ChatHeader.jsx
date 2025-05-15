import React from 'react';
import { X } from "lucide-react";
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // 🔒 Prevent rendering if no user is selected
  if (!selectedUser) return null;

  return (
    <div className='p-2.5 border-b border-base-300'>
      <div className='flex items-center justify-between'>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className='font-medium text-base-content'>
              {selectedUser.fullName}
            </h3>
            <p className='text-sm text-base-content/70'>
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              {/* onlineUsers is an array of IDs; check if selectedUser is in it */}
            </p>
          </div>
        </div>

        <button onClick={() => setSelectedUser(null)} className="text-base-content">
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
