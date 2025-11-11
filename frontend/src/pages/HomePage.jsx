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
    <div className="h-screen pt-16 bg-gradient-to-br from-base-200 via-base-300 to-base-100 dark:from-base-300 dark:via-base-100 dark:to-base-200 flex overflow-hidden relative animate-shimmer">
      {/* Custom CSS for animations (add to your global CSS or Tailwind config) */}
      <style jsx>{`
        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-shimmer {
          background-size: 200% 200%;
          animation: shimmer 8s ease-in-out infinite;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .pulse-subtle {
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
      `}</style>

      {/* Backdrop for mobile sidebar (click to close) */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Enhanced Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 glassmorphism rounded-xl shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-base-300/20 group"
        aria-label="Open contacts"
      >
        <Menu
          size={24}
          className="text-base-content group-hover:rotate-90 transition-transform duration-300"
        />
      </button>

      {/* Sidebar with Fixed Slide Animation for Mobile, Always Visible on Desktop */}
      <div
        className={`transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:relative lg:translate-x-0`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Chat Container - Enhanced with Fade-In and Better Spacing */}
      <div className="w-full lg:w-3/5 h-full flex flex-col overflow-hidden">
        {!selectedUser ? (
          <div className="flex justify-center items-center h-full w-full pulse-subtle">
            <NoChatSelected />
          </div>
        ) : (
          <div className="flex-1 p-4 h-full fade-in">
            <ChatContainer />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
