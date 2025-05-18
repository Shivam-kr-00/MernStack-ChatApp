import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { formatMessageTime } from '../lib/utils';

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

  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
    <div className="flex-1 flex flex-col h-full bg-base-200/50 backdrop-blur-md">
      <ChatHeader />

      {/* Scrollable Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 chat-scrollbar">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? 'chat-end' : 'chat-start'
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border border-base-content/10">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || '/avatar.png'
                      : selectedUser.profilePic || '/avatar.png'
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs text-base-content/50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* ✅ FIXED: Force black text in light mode */}
  <div className={`chat-bubble flex flex-col ${
  message.senderId === authUser._id
    ? 'chat-bubble flex flex-col bg-base-300/90 backdrop-blur-sm text-base-content'
    : 'bg-base-300/90 backdrop-blur-sm text-base-content'
}`}>

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
        ))}

        <div ref={messageEndRef} />
      </div>

      {/* Chat Input at the Bottom */}
      <div className="border-t border-base-300/50 bg-base-200/50 backdrop-blur-md">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
