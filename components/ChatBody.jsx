import Message from "./Message";
import MessageContent from "./MessageContent";
import ChatSeparator from "./ChatSeparator";
import Avatar from "./Avatar";
import { useRef, useEffect } from "react";
import { GIRL_1_IMAGE } from "../utils/images";

export default function ChatBody({ thread }) {
  const scrollTo = useRef();

  useEffect(() => {
    scrollTo.current.scrollIntoView();
  });

  useEffect(() => {
    // API call where we can get chat messages
  }, [thread]);

  return (
    <div className="flex flex-col grow p-6 bg-chat scrollbar-hide overflow-y-auto">
      <div className="py-3">
        <Message>
          <MessageContent index={0}>
            Look at this field! Beautiful!
          </MessageContent>
          <MessageContent padding={false}>
            <img
              className="w-62 h-48"
              width="300"
              height="400"
              src={GIRL_1_IMAGE}
              alt=""
            />
          </MessageContent>
        </Message>
      </div>
      <ChatSeparator>Today</ChatSeparator>
      <div className="py-3">
        <Message currentUser={true}>
          <MessageContent index={0} currentUser={true}>
            This is Content! This is Content! This is Content! This is Content!
            This is Content!
          </MessageContent>
          <MessageContent currentUser={true}>
            This is Content! This is Content! This is Content! This is Content!
            This is Content!
          </MessageContent>
          <MessageContent currentUser={true} padding={false}>
            <img
              className="w-48 h-62"
              width="300"
              height="300"
              src="https://images.unsplash.com/photo-1563450151580-e391a277d92b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=300"
              alt=""
            />
          </MessageContent>
        </Message>
      </div>
      <div className="py-3">
        <Message>
          <MessageContent index={0}>
            This is Content! This is Content! This is Content! This is Content!
          </MessageContent>
        </Message>
      </div>
      <div ref={scrollTo}></div>
    </div>
  );
}
