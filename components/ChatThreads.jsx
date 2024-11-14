import Thread from "./Thread";
import {
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/solid";
import ThreadHeader from "./ThreadHeader";
import { GIRL_3_IMAGE } from "../utils/images";
import { threads } from "../utils/data";
import { useState } from "react";

export default function ContactsList({ onClick }) {
  const [query, setQuery] = useState("");

  let threadsArray = threads.filter((thread) => {
    return thread.name.toLowerCase().includes(query.toLowerCase());
  });

  function handleSearch(event) {
    setQuery(event.target.value);
  }

  return (
    <div className="grow lg:shrink-0 scrollbar-hide overflow-y-auto lg:max-w-xs">
      <ThreadHeader onSearch={handleSearch} />
      <div className="p-6">
        <p className="flex items-center text-gray-400">
          <BookmarkIcon className="w-5 h-5" />

          <span className="uppercase text-sm font-medium ml-3">Bookmarked</span>
        </p>
        <div>
          <Thread
            userData={{
              isOnline: true,
              shortName: "C",
              avatar: GIRL_3_IMAGE,
              isReaded: true,
            }}
          />
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
          {threadsArray.map((userData, i) => (
            <Thread
              userData={userData}
              onClick={() => onClick(userData)}
              key={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
