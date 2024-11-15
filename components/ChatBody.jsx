// /components/ChatBody.jsx
import React, { useRef, useEffect } from "react";
import Message from "./Message";
import MessageContent from "./MessageContent";
import ChatSeparator from "./ChatSeparator";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";

export default function ChatBody({ thread }) {
  const scrollTo = useRef();

  useEffect(() => {
    scrollTo.current.scrollIntoView();
  });

  const hasMessages = thread.messages && thread.messages.length > 0;

  if (!hasMessages) {
    return (
      <div className="flex flex-col grow p-6 bg-chat scrollbar-hide overflow-y-auto">
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

  return (
    <div className="flex flex-col grow p-6 bg-chat scrollbar-hide overflow-y-auto">
      <ChatSeparator>Today</ChatSeparator>
      {thread.messages.map((message, index) => (
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
      <div ref={scrollTo}></div>
    </div>
  );
}