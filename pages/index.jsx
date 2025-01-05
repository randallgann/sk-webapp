// HomePage.jsx
import { useState } from "react";
import Head from "next/head";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import ChatThreads from "../components/ChatThreads";
import Navigation from "../components/Navigation";
import Chat from "../components/Chat";
import Profile from "../components/Profile";

function HomePage() {
  const [chatVisible, setChatVisible] = useState(true);
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
      setChatVisible(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen overflow-hidden relative">
      <Head>
        <title>Mikey & Me Chat</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Mikey and Me Chatbot" />
      </Head>

      {/* Mobile Menu Tab */}
      <div 
        onClick={() => setDrawerOpen(!drawerOpen)}
        className={`lg:hidden fixed top-1/4 left-0 z-50 cursor-pointer
          bg-white shadow-lg hover:bg-gray-50 transition-colors duration-200
          px-2 py-8 rounded-r-lg
          ${drawerOpen ? 'translate-x-[320px]' : 'translate-x-0'}
          transition-transform duration-300 ease-in-out`}
        aria-label="Toggle chat threads"
      >
        {drawerOpen ? (
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        ) : (
          <ChevronRightIcon className="w-6 h-6 text-gray-600" />
        )}
      </div>

      {/* Backdrop overlay */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30 transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div className="hidden lg:block">
        <Navigation />
      </div>

      {/* ChatThreads wrapper */}
      <div
        className={`fixed lg:relative lg:translate-x-0 z-40 h-full transition-transform duration-300 ease-in-out flex-shrink-0
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          md:block w-[320px]`}
      >
        <ChatThreads
          onClick={handleThreadClick}
          onDelete={handleThreadDelete}
        />
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 justify-center min-w-0">
      <Chat
        thread={activeThread}
        isVisible={chatVisible}
        onClick={() => setChatVisible(true)}
        className="h-full"
      />
      </div>
      </div>
  );
}

export default HomePage;
