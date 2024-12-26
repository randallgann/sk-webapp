import ChatThreads from "../components/ChatThreads";
import Navigation from "../components/Navigation";
import Chat from "../components/Chat";
import Profile from "../components/Profile";
import { useState } from "react";
import Head from "next/head";

function HomePage() {
  const [chatVisible, setChatVisible] = useState(false);
  const [activeThread, setActiveThread] = useState(null);

  const handleThreadClick = (thread) => {
    setActiveThread(thread);
    setChatVisible(true);
  };

  const handleThreadDelete = (threadId) => {
    if (activeThread?.id === threadId) {
      setActiveThread(null);
      setChatVisible(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen overflow-hidden">
      <Head>
        <title>Mikey & Me Chat</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Mikey and Me Chatbot" />
      </Head>
      <ChatThreads onClick={handleThreadClick}
        onDelete={handleThreadDelete} 
        className="h-full"/>
      <Chat
        thread={activeThread}
        isVisible={chatVisible}
        onClick={() => setChatVisible(false)}
        className="h-full flex-1"
      />
      {/* <Profile /> */}
      <Navigation />
    </div>
  );
}

export default HomePage;
