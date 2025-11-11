import React from "react";
import { MessageSquare, Users } from "lucide-react"; // Added Users for the button icon

const NoChatSelected = ({ onFindFriends }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-base-content p-8 bg-[radial-gradient(circle_at_center,_rgba(229,231,235,0.5)_0%,_rgba(209,213,219,0.5)_100%)] dark:bg-[radial-gradient(circle_at_center,_rgba(209,213,219,0.5)_0%,_rgba(243,244,246,0.5)_100%)] backdrop-blur-md rounded-2xl shadow-inner animate-in animate-in-fade-in animate-in-duration-800 animate-in-easing-out animate-in-slide-in-from-bottom-5">
      {/* Icon Container - Enhanced with Gradient, Glassmorphism, and Pulse */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center mb-6 animate-pulse hover:-translate-y-1 hover:shadow-xl transition-transform duration-300 transition-shadow duration-300">
        <MessageSquare className="text-primary" size={36} />
      </div>

      {/* Title - Added Gradient Text */}
      <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        No Conversation Selected
      </h3>

      {/* Description */}
      <p className="text-base-content/60 max-w-md mb-6 text-sm sm:text-base">
        Select a contact from the sidebar to start messaging or create a new
        conversation.
      </p>

      {/* Call-to-Action Button - Added for Interactivity */}
      <button
        className="btn btn-primary btn-outline rounded-xl px-6 py-3 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-105 transition-shadow duration-300 transition-transform duration-300 flex items-center gap-2"
        onClick={() => {
          // Placeholder: You can add logic here, e.g., open sidebar or navigate to friends page
          {
            onFindFriends;
          }
          // Example: If you have a way to open the sidebar, call it here
        }}
        aria-label="Find friends to start chatting"
      >
        <Users size={18} />
        Find Friends
      </button>
    </div>
  );
};

export default NoChatSelected;
