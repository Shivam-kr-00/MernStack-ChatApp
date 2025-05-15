import React from 'react';
import { MessageSquare } from 'lucide-react';

const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-base-content p-8 bg-base-200/50 backdrop-blur-md rounded-lg">
      <div className="w-20 h-20 rounded-full bg-base-content/10 flex items-center justify-center mb-4">
        <MessageSquare className="text-primary" size={36} />
      </div>
      <h3 className="text-2xl font-bold mb-2">No Conversation Selected</h3>
      <p className="text-base-content/60 max-w-md">
        Select a contact from the sidebar to start messaging or create a new conversation.
      </p>
    </div>
  );
};

export default NoChatSelected;
