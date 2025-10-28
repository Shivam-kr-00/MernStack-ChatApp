import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import socket from "../lib/socket.js"; // ✅ Real-time connection
import { detectEmotion } from "../lib/sentiment"; // ✅ Emotion analyzer

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
    selectedUser._id,
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
      const timer = setTimeout(() => setSuggestedMessage(""), 8000); // ⏳ Auto-clear in 8s
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
    <div className="flex-1 flex flex-col h-full bg-base-200/50 dark:bg-base-300/50 backdrop-blur-md rounded-lg shadow-inner">
      <ChatHeader />

      {/* ✅ AI-Suggested Message Box */}
      {suggestedMessage && (
        <div className="px-4 py-2 my-2 mx-4 rounded-lg text-sm font-semibold text-base-content bg-base-300/90 dark:bg-base-200/90 backdrop-blur-md border border-base-300 shadow-sm">
          💡 {suggestedMessage}
        </div>
      )}

      {/* ✅ Scrollable Message Area - Flex-1 for proper sizing */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 chat-scrollbar">
        {messages.map((message) => {
          const emotion = detectEmotion(message.text || "");

          const emotionStyles = {
            "Happy 😊":
              "bg-green-200 dark:bg-green-800/40 border-green-400 dark:border-green-500",
            "Angry 😠":
              "bg-red-200 dark:bg-red-800/40 border-red-400 dark:border-red-500",
            "Neutral 😐":
              "bg-gray-200 dark:bg-gray-700/40 border-gray-400 dark:border-gray-500",
          };

          const emotionStyle =
            emotionStyles[emotion] ||
            "bg-base-300/90 dark:bg-base-200/90 border-base-300";

          return (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
            >
              {/* ✅ Avatar */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border border-base-content/10 shadow-sm">
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

              {/* ✅ Message Bubble with Emotion-Based Styling */}
              <div
                className={`chat-bubble flex flex-col backdrop-blur-sm text-base-content border shadow-sm rounded-lg ${emotionStyle}`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}

        {/* ✅ Scroll Anchor */}
        <div ref={messageEndRef} />
      </div>

      {/* ✅ Message Input Field - Sticky on mobile, normal on desktop */}
      <div className="lg:static lg:relative sticky bottom-0 bg-base-200/50 dark:bg-base-300/50 backdrop-blur-md border-t border-base-300/50 shadow-lg">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
