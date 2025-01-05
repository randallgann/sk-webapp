// /components/ChatThreads.jsx
import React, { useState, useEffect } from 'react';
import { chatService } from '../utils/chatService';
import Thread from "./Thread";
import {
  BookmarkIcon as BookmarkSolidIcon,
  ChatBubbleOvalLeftIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkOutlineIcon } from "@heroicons/react/24/outline";
import ThreadHeader from "./ThreadHeader";
import { ThreadService } from '../utils/apiService';

export default function ChatThreadsList({ onClick, onDelete }) {
  const [query, setQuery] = useState("");
  const [regularThreads, setRegularThreads] = useState([]);
  const [bookmarkedThreads, setBookmarkedThreads] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const threads = await chatService.getAllThreads();
      
      // Separate threads into regular and bookmarked
      const bookmarked = threads.filter(thread => thread.isBookmarked);
      const regular = threads.filter(thread => !thread.isBookmarked);
      
      setBookmarkedThreads(bookmarked);
      setRegularThreads(regular);
    } catch (err) {
      console.error('Failed to load threads:', err);
      setError('Failed to load threads. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  
  // Helper function to get the next available thread
  const getNextAvailableThread = (deletedThreadId) => {
    // First check bookmarked threads
    const allThreads = [...bookmarkedThreads, ...regularThreads];
    const currentIndex = allThreads.findIndex(thread => thread.id === deletedThreadId);
    
    // If there are any threads left after deletion
    if (allThreads.length > 1) {
      // If it's the last thread, return the previous one
      if (currentIndex === allThreads.length - 1) {
        return allThreads[currentIndex - 1];
      }
      // Otherwise return the next thread
      return allThreads[currentIndex + 1] || allThreads[0];
    }
    return null;
  };

  // Filter threads based on search query
  const filteredRegularThreads = regularThreads.filter((thread) => {
    return thread.name.toLowerCase().includes(query.toLowerCase());
  });

  const filteredBookmarkedThreads = bookmarkedThreads.filter((thread) => {
    return thread.name.toLowerCase().includes(query.toLowerCase());
  });

  function handleSearch(event) {
    setQuery(event.target.value);
  }

  // Update the handleUpdateThread function for bookmarking
const handleUpdateThread = async (thread, isBookmarked) => {
  try {
    const updatedThreadData = {
      ...thread,
      isBookmarked,
      name: thread.name // Ensure we pass the name for mapping
    };

    const updatedThread = await ThreadService.updateThread(thread.id, updatedThreadData);
    return updatedThread;
  } catch (error) {
    console.error('Failed to update thread:', error);
    throw error;
  }
};

  const handleCreateThread = async () => {
    try {
      setIsCreating(true);
      
      const threadData = {
      name: `Thread ${regularThreads.length + bookmarkedThreads.length + 1}`,
      // Only include fields that will be mapped to what the backend expects
      isOnline: true,
      isBookmarked: false
    };

      // Send POST request to create thread
      const createdThread = await ThreadService.createThread(threadData);
      
      // Update local state with the created thread
      setRegularThreads(prevThreads => [...prevThreads, createdThread]);
      
      // Notify parent component
      onClick(createdThread);
    } catch (error) {
      console.error('Failed to create thread:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsCreating(false);
    }
  };

    const handleDeleteThread = async (threadId, isBookmarked) => {
    try {
      const nextThread = getNextAvailableThread(threadId);
      // Send DELETE request to remove thread
      await ThreadService.deleteThread(threadId);
      
      // Update local state
      if (isBookmarked) {
        setBookmarkedThreads(prevThreads => 
          prevThreads.filter(thread => thread.id !== threadId)
        );
      } else {
        setRegularThreads(prevThreads => 
          prevThreads.filter(thread => thread.id !== threadId)
        );
      }

      if (nextThread) {
        onClick(nextThread);
      } else {
        onClick(null);
      }

      // Notify parent about thread deletion
      onDelete(threadId);

    } catch (error) {
      console.error('Failed to delete thread:', error);
      // You might want to show an error message to the user here
    }
  };

    const handleBookmark = async (thread) => {
  try {
    const updatedThread = await handleUpdateThread(thread, true);
    setRegularThreads(prevThreads => prevThreads.filter(t => t.id !== thread.id));
    setBookmarkedThreads(prevThreads => [...prevThreads, updatedThread]);
  } catch (error) {
    console.error('Failed to bookmark thread:', error);
  }
};

const handleUnbookmark = async (thread) => {
  try {
    const updatedThread = await handleUpdateThread(thread, false);
    setBookmarkedThreads(prevThreads => prevThreads.filter(t => t.id !== thread.id));
    setRegularThreads(prevThreads => [...prevThreads, updatedThread]);
  } catch (error) {
    console.error('Failed to unbookmark thread:', error);
  }
};

  // Thread component with action buttons
  const ThreadWithActions = ({ userData, onClick, isBookmarked = false }) => {
    return (
      <div className="relative group">
        <Thread userData={userData} onClick={onClick} />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-200 flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              isBookmarked ? handleUnbookmark(userData) : handleBookmark(userData);
            }}
            className="p-2 hover:bg-blue-100 rounded-full"
            title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="w-4 h-4 text-blue-500" />
            ) : (
              <BookmarkOutlineIcon className="w-4 h-4 text-blue-500 hover:text-blue-600" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteThread(userData.id, isBookmarked);
            }}
            className="p-2 hover:bg-red-100 rounded-full"
            title="Delete thread"
          >
            <TrashIcon className="w-4 h-4 text-red-500 hover:text-red-600" />
          </button>
        </div>
      </div>
    );
  };

  const CreateThreadButton = () => (
    <div className="mt-4 px-2">
      <button
        onClick={handleCreateThread}
        disabled={isCreating}
        className={`flex items-center justify-center space-x-2 w-full ${
          isCreating ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
        } text-white px-6 py-3 rounded-lg transition-colors duration-200`}
      >
        <PlusCircleIcon className="w-6 h-6" />
        <span>{isCreating ? 'Creating...' : 'Create New Thread'}</span>
      </button>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-white shadow-lg lg:shadow-none h-screen">
      <ThreadHeader onSearch={handleSearch} />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* <p className="flex items-center text-gray-400">
            <BookmarkSolidIcon className="w-5 h-5" />
            <span className="uppercase text-sm font-medium ml-3">Bookmarked</span>
          </p> */}
          <div>
            {filteredBookmarkedThreads.map((userData) => (
              <ThreadWithActions
                userData={userData}
                onClick={() => onClick(userData)}
                key={userData.id}
                isBookmarked={true}
              />
            ))}
          </div>
        </div>
        <div className="p-6">
          <p className="flex items-center text-gray-400">
            <ChatBubbleOvalLeftIcon className="w-5 h-5" />
            <span className="uppercase text-sm font-medium ml-3">
              All Messages
            </span>
          </p>
          <div>
            {filteredRegularThreads.map((userData) => (
              <ThreadWithActions
                userData={userData}
                onClick={() => onClick(userData)}
                key={userData.id}
                isBookmarked={false}
              />
            ))}
          </div>
        </div>
        <div className="p-4">
          <CreateThreadButton />
        </div>
      </div>
    </div>
  );
}
