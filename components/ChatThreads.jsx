// /components/ChatThreads.jsx
import React, { useState } from 'react';
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

export default function ContactsList({ onClick, onDelete }) {
  const [query, setQuery] = useState("");
  const [regularThreads, setRegularThreads] = useState([]);
  const [bookmarkedThreads, setBookmarkedThreads] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleCreateThread = async () => {
    try {
      setIsCreating(true);
      
      const threadData = {
        name: `Thread ${regularThreads.length + bookmarkedThreads.length + 1}`,
        isOnline: true,
        shortName: "T",
        isReaded: true,
        lastMessage: "New thread created",
        time: new Date().toLocaleTimeString(),
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
      // Notify parent about thread deletion
      onDelete(threadId);
    } catch (error) {
      console.error('Failed to delete thread:', error);
      // You might want to show an error message to the user here
    }
  };

    const handleBookmark = async (thread) => {
    try {
      // Send PUT request to update thread's bookmark status
      const updatedThread = await ThreadService.updateThread(thread.id, {
        ...thread,
        isBookmarked: true
      });

      // Update local state
      setRegularThreads(prevThreads => 
        prevThreads.filter(t => t.id !== thread.id)
      );
      setBookmarkedThreads(prevThreads => [...prevThreads, updatedThread]);
    } catch (error) {
      console.error('Failed to bookmark thread:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleUnbookmark = async (thread) => {
    try {
      // Send PUT request to update thread's bookmark status
      const updatedThread = await ThreadService.updateThread(thread.id, {
        ...thread,
        isBookmarked: false
      });

      // Update local state
      setBookmarkedThreads(prevThreads => 
        prevThreads.filter(t => t.id !== thread.id)
      );
      setRegularThreads(prevThreads => [...prevThreads, updatedThread]);
    } catch (error) {
      console.error('Failed to unbookmark thread:', error);
      // You might want to show an error message to the user here
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
    <div className="grow lg:shrink-0 scrollbar-hide overflow-y-auto lg:max-w-xs">
      <ThreadHeader onSearch={handleSearch} />
      <div className="p-6">
        <p className="flex items-center text-gray-400">
          <BookmarkSolidIcon className="w-5 h-5" />
          <span className="uppercase text-sm font-medium ml-3">Bookmarked</span>
        </p>
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
          <CreateThreadButton />
        </div>
      </div>
    </div>
  );
}