import React, { useRef, useEffect, useState } from "react";
import Message from "./Message";
import MessageContent from "./MessageContent";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";

export default function ChatBody({ thread, messages, isTyping, botStatus }) {
  const scrollTo = useRef();
  
  useEffect(() => {
    // Scroll to bottom whenever messages change or typing status changes
    scrollTo.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Show empty state when no messages and not typing
  if (!messages?.length && !isTyping) {
    return (
      <div className="flex-1 flex-col grow p-6 bg-chat scrollbar-hide overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <ChatBubbleBottomCenterIcon className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Starting new conversation
            </h3>
            <p className="text-sm text-gray-500">
              The AI assistant will respond shortly...
            </p>
          </div>
        </div>
        <div ref={scrollTo}></div>
      </div>
    );
  }

  // Sort messages by timestamp
  const sortedMessages = [...(messages || [])].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    
    <div className="flex flex-col grow p-6 bg-chat scrollbar-hide overflow-y-auto justify-end">
      {sortedMessages.map((message) => (
        <div key={message.id} className="py-3">
          <Message currentUser={message.isCurrentUser}>
            <MessageContent 
              index={0} 
              currentUser={message.isCurrentUser}
            >
              {message.content}
            </MessageContent>
          </Message>
        </div>
      ))}

      {isTyping && botStatus && (
        <div className="py-3">
          <Message currentUser={false}>
            <MessageContent 
              index={0} 
              currentUser={false}
              isTyping={true}
            >
              {botStatus}...
            </MessageContent>
          </Message>
        </div>
      )}
      
      <div ref={scrollTo}></div>
    </div>
  );
}
