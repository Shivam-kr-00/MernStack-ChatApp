import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import socket from "../lib/socket.js"; // ✅ Real-time connection
import { detectEmotion } from "../lib/sentiment"; // ✅ Emotion analyzer
import { File } from "lucide-react"; // Added for file icon
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css"; // Default styles (you can override with Tailwind)

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [suggestedMessage, setSuggestedMessage] = useState(""); // ✅ Feedback message

  // ✅ Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // ✅ Auto-scroll to the latest message (enhanced for mobile)
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, suggestedMessage]);

  // ✅ Generate suggestion from latest message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const emotion = lastMessage?.text ? detectEmotion(lastMessage.text) : null;
    const suggestion = emotionToSuggestion(emotion);
    setSuggestedMessage(suggestion);

    if (suggestion) {
      const timer = setTimeout(() => setSuggestedMessage(""), 6000); // ⏳ Auto-clear in 6s
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // ✅ Suggestion text based on emotion
  const emotionToSuggestion = (emotion) => {
    switch (emotion) {
      case "Happy 😊":
        return "Keep spreading the positivity! 🌟";
      case "Angry 😠":
        return "Try taking a deep breath or a short break. 🧘‍♂️";
      case "Neutral 😐":
        return "Let me know if I can assist you better. 🤝";
      default:
        return "";
    }
  };

  // ✅ Show loading skeleton while messages are loading
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-radial from-base-200/50 to-base-300/50 dark:from-base-300/50 dark:to-base-100/50 backdrop-blur-md rounded-2xl shadow-inner overflow-hidden animate-fadeIn">
      {/* Custom CSS for animations */}
      <style jsx>{`
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
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .message-slide-in {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .message-slide-in.sent {
          animation: slideInSent 0.5s ease-out forwards;
        }
        @keyframes slideInSent {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .bubble-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .bubble-hover:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .media-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .media-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
        .suggested-fade {
          animation: suggestedFade 0.5s ease-in-out;
        }
        @keyframes suggestedFade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .pulse-subtle {
          animation: pulse 3s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
        .glassmorphism {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <ChatHeader />

      {/* ✅ AI-Suggested Message Box - Enhanced with Animation and Glassmorphism */}
      {suggestedMessage && (
        <div className="px-4 py-2 my-2 mx-4 rounded-xl text-sm font-semibold text-base-content glassmorphism border border-base-300/50 shadow-lg suggested-fade pulse-subtle">
          💡 {suggestedMessage}
        </div>
      )}

      {/* ✅ Scrollable Message Area - Added Gradient Background */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 chat-scrollbar pb-20 lg:pb-0 bg-gradient-to-b from-transparent to-base-100/20">
        {messages.map((message, index) => {
          const emotion = detectEmotion(message.text || "");

          const emotionStyles = {
            "Happy 😊":
              "bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800/40 dark:to-green-700/40 border-green-400 dark:border-green-500",
            "Angry 😠":
              "bg-gradient-to-r from-red-200 to-red-300 dark:from-red-800/40 dark:to-red-700/40 border-red-400 dark:border-red-500",
            "Neutral 😐":
              "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700/40 dark:to-gray-600/40 border-gray-400 dark:border-gray-500",
          };

          const emotionStyle =
            emotionStyles[emotion] ||
            "bg-gradient-to-r from-base-300/90 to-base-200/90 dark:from-base-200/90 dark:to-base-300/90 border-base-300";

          // Updated: Render media with hover effects and better responsiveness
          const renderMedia = () => {
            if (!message.media) return null;
            const { type, url, filename } = message.media;
            if (type === "image") {
              return (
                <img
                  src={url}
                  alt={filename}
                  className="sm:max-w-[200px] rounded-lg mb-2 shadow-md media-hover"
                  loading="lazy" // Performance boost
                />
              );
            }
            if (type === "video") {
              return (
                <video
                  controls
                  src={url}
                  className="sm:max-w-[200px] rounded-lg mb-2 shadow-md media-hover"
                  preload="metadata"
                />
              );
            }
            if (type === "audio") {
              return (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-base-100 to-base-200 dark:from-base-300 dark:to-base-200 rounded-xl border border-base-300/50 shadow-md media-hover mb-2 max-w-[300px]">
                  {/* Audio Icon */}
                  <div className="flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-primary dark:text-primary-focus"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                  {/* Filename and Custom Audio Player */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-base-content truncate mb-2">
                      {filename}
                    </p>
                    <AudioPlayer
                      src={url}
                      preload="metadata"
                      className="custom-audio-player"
                      style={{
                        background: "transparent",
                        color: "var(--tw-text-base-content)",
                      }}
                    />
                  </div>
                </div>
              );
            }
            if (type === "file") {
              return (
                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-base-100 to-base-200 dark:from-base-300 dark:to-base-200 rounded-lg mb-2 shadow-md media-hover">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-content hover:text-primary transition-colors"
                    title={`Open ${filename}`}
                    aria-label={`Open file: ${filename}`}
                  >
                    <File size={16} />
                  </a>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-base-content hover:text-primary transition-colors truncate"
                    title={`Open ${filename}`}
                    aria-label={`Open file: ${filename}`}
                  >
                    {filename}
                  </a>
                </div>
              );
            }
            return null;
          };

          return (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              } message-slide-in ${
                message.senderId === authUser._id ? "sent" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }} // Staggered slide-in
            >
              {/* ✅ Avatar - Added Hover Effect */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border border-base-content/10 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic ||
                          "https://res.cloudinary.com/dahpi68b7/image/upload/v1761576531/avatar_boeayu.png"
                        : selectedUser.profilePic ||
                          "https://res.cloudinary.com/dahpi68b7/image/upload/v1761576531/avatar_boeayu.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              {/* ✅ Timestamp */}
              <div className="chat-header mb-1 text-xs text-base-content/50">
                {formatMessageTime(message.createdAt)}
              </div>

              {/* ✅ Message Bubble with Emotion-Based Styling and Hover */}
              <div
                className={`chat-bubble flex flex-col backdrop-blur-sm text-base-content border shadow-md rounded-xl bubble-hover ${emotionStyle}`}
              >
                {renderMedia()}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}

        {/* ✅ Scroll Anchor */}
        <div ref={messageEndRef} />
      </div>

      {/* ✅ Message Input Field - Enhanced with Gradient */}
      <div className="fixed bottom-0 left-0 right-0 lg:static lg:relative lg:sticky lg:bottom-0 bg-gradient-to-t from-base-200/50 to-base-300/50 dark:from-base-300/50 dark:to-base-100/50 backdrop-blur-md border-t border-base-300/50 shadow-lg rounded-t-2xl lg:rounded-none">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
