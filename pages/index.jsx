// HomePage.jsx
import { useState } from "react";
import Head from "next/head";
import { Bars3Icon } from "@heroicons/react/24/solid";
import ChatThreads from "../components/ChatThreads";
import Navigation from "../components/Navigation";
import Chat from "../components/Chat";
import Profile from "../components/Profile";

function HomePage() {
  const [chatVisible, setChatVisible] = useState(false);
  const [activeThread, setActiveThread] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleThreadClick = (thread) => {
    setActiveThread(thread);
    setChatVisible(true);
    setDrawerOpen(false); // Close drawer after selection on mobile
  };

  const handleThreadDelete = (threadId) => {
    if (activeThread?.id === threadId) {
      setActiveThread(null);
      setChatVisible(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen overflow-hidden relative overflow-hidden">
      <Head>
        <title>Mikey & Me Chat</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Mikey and Me Chatbot" />
      </Head>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setDrawerOpen(!drawerOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
        aria-label="Toggle chat threads"
      >
        <Bars3Icon className="w-6 h-6 text-gray-600" />
      </button>

      {/* Backdrop overlay */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30 transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ChatThreads wrapper */}
      <div
        className={`fixed lg:relative lg:translate-x-0 z-40 h-full transition-transform duration-300 ease-in-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:block w-[320px]`}
      >
        <ChatThreads
          onClick={handleThreadClick}
          onDelete={handleThreadDelete}
        />
      </div>

      {/* Main chat area */}
      {/* <div className="flex-1 h-full lg:ml-0"> */}
        <Chat
          thread={activeThread}
          isVisible={chatVisible}
          onClick={() => setChatVisible(false)}
          className="h-full"
        />
      {/* </div> */}
      <div className="hidden lg:block">
        <Navigation />
      </div>
    </div>
  );
}

export default HomePage;
