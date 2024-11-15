// /components/ChatBody.jsx
import React, { useRef, useEffect } from "react";
import ChatSeparator from "./ChatSeparator";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";

export default function ChatBody({ thread }) {
  const scrollTo = useRef();

  useEffect(() => {
    scrollTo.current.scrollIntoView();
  });

  // Check if this is a new thread (no messages)
  const isNewThread = !thread.messages || thread.messages.length === 0;

  if (isNewThread) {
    return (
      <div className="flex flex-col grow p-6 bg-chat scrollbar-hide overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <ChatBubbleBottomCenterIcon className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">
              No messages yet
            </h3>
            <p className="text-sm text-gray-500">
              Start the conversation by sending your first message!
            </p>
          </div>
        </div>
        <div ref={scrollTo}></div>
      </div>
    );
  }

  // If there are messages, render them (keeping your original message rendering logic)
  return (
    <div className="flex flex-col grow p-6 bg-chat scrollbar-hide overflow-y-auto">
      <ChatSeparator>Today</ChatSeparator>
      {thread.messages && thread.messages.map((message, index) => (
        // Your existing message rendering code here
        // This is just a placeholder - keep your original message rendering logic
        <div key={index} className="py-3">
          {/* Your Message components here */}
        </div>
      ))}
      <div ref={scrollTo}></div>
    </div>
  );
}