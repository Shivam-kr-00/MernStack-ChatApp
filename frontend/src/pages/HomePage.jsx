import React from 'react';
import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen pt-16 bg-gradient-to-br from-base-200 to-base-300 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-2/5 h-full overflow-y-auto custom-scrollbar">
        <Sidebar />
      </div>

      {/* Chat Container */}
      <div className="w-3/5 h-full overflow-y-auto custom-scrollbar">
        {!selectedUser ? (
          <div className="flex justify-center items-center h-full w-full">
            <NoChatSelected />
          </div>
        ) : (
          <div className="p-4 h-full">
            <ChatContainer />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
