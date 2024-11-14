import { BellIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

export default function ThreadHeader({ onSearch }) {
  return (
    <div className="flex flex-col gap-3 p-6 bg-chat md:bg-white sticky top-0 z-10 border-b">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl">Chats</h1>
        <div className="flex items-center gap-3 text-gray-400">
          <a className="block w-5 h-5" href="#" aria-label="Notification">
            <BellIcon className="w-full h-full" />
          </a>
          <a className="block w-5 h-5" href="#" aria-label="Chat settings">
            <EllipsisVerticalIcon className="w-full h-full" />
          </a>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="flex items-center shrink-0 gap-1 py-1 px-3 border border-gray-400 rounded-md"
          type="button"
        >
          <span>All Chats</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>

        <div className="relative w-full">
          <label>
            <input
              className="w-full py-1 px-2 pr-6 border border-gray-400 rounded-md"
              placeholder="Search users"
              type="text"
              onChange={onSearch}
            />
          </label>
          <MagnifyingGlassIcon className="absolute top-1/2 -translate-y-1/2 right-2 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
