import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { Menu } from "lucide-react"; // Import for hamburger icon

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  return (
    <div className="h-screen pt-16 bg-gradient-to-br from-base-200 to-base-300 dark:from-base-300 dark:to-base-100 flex overflow-hidden relative">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-base-200 dark:bg-base-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 border border-base-300/20"
        aria-label="Open contacts"
      >
        <Menu size={24} className="text-base-content" />
      </button>

      {/* Sidebar (Responsive) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Chat Container - Added flex-col for mobile stacking */}
      <div className="w-full lg:w-3/5 h-full flex flex-col overflow-hidden">
        {!selectedUser ? (
          <div className="flex justify-center items-center h-full w-full">
            <NoChatSelected />
          </div>
        ) : (
          <div className="flex-1 p-4 h-full">
            <ChatContainer />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
