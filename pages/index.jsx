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
    <div className="flex flex-col lg:flex-row">
      <Head>
        <title>TailChat</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="TailChat for make connections" />
      </Head>
      <ChatThreads onClick={handleThreadClick}
        onDelete={handleThreadDelete} />
      <Chat
        thread={activeThread}
        isVisible={chatVisible}
        onClick={() => setChatVisible(false)}
      />
      <Profile />
      <Navigation />
    </div>
  );
}

export default HomePage;
