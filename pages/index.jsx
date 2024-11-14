import ChatThreads from "../components/ChatThreads";
import Navigation from "../components/Navigation";
import Chat from "../components/Chat";
import Profile from "../components/Profile";
import { useState } from "react";
import Head from "next/head";
import { threads } from "../utils/data";

function HomePage() {
  const [chatVisible, setChatVisible] = useState(false);
  const [activeThread, setActiveThread] = useState(threads[0]);

  const handleThreadClick = (thread) => {
    setActiveThread(thread);
    setChatVisible(!chatVisible);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <Head>
        <title>TailChat</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="TailChat for make connections" />
      </Head>
      <ChatThreads onClick={handleThreadClick} />
      <Chat
        thread={activeThread}
        isVisible={chatVisible}
        onClick={handleThreadClick}
      />
      <Profile />
      <Navigation />
    </div>
  );
}

export default HomePage;
