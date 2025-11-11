import React, { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Automatically close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Automatically close sidebar when a user is selected (mobile only)
  useEffect(() => {
    if (selectedUser && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [selectedUser]);

  return (
    <div className="h-screen pt-16 bg-gradient-to-br from-base-200 via-base-300 to-base-100 dark:from-base-300 dark:via-base-100 dark:to-base-200 flex overflow-hidden relative animate-shimmer">
      {/* ✨ Custom animations */}
      <style>{`
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
        .glassmorphism {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* 🍔 Hamburger Button (only on mobile) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 glassmorphism rounded-xl shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-base-300/20 group"
        aria-label="Open sidebar"
      >
        <Menu
          size={24}
          className="text-base-content group-hover:rotate-90 transition-transform duration-300"
        />
      </button>

      {/* 🌑 Overlay (close on click outside) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🧱 Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 lg:relative lg:h-auto z-50 lg:z-auto transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* 💬 Chat Area */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        {!selectedUser ? (
          <div className="flex justify-center items-center h-full w-full">
            <NoChatSelected onFindFriends={() => navigate("/friends")} />
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
