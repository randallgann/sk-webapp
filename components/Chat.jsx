import ChatBody from "./ChatBody";
import {
  VideoCameraIcon,
  PhoneIcon,
  ChatBubbleOvalLeftIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Avatar from "./Avatar";

export default function Chat({ thread, isVisible, onClick }) {
  const displayStyle = isVisible ? "translate-x-0" : "translate-x-full";

  return (
    <div
      className={`${displayStyle} lg:translate-x-0 fixed inset-0 h-full lg:relative lg:inset-auto flex flex-col grow w-full border-x border-gray-100 bg-white z-10 transition`}
    >
      <div className="flex items-center h-24 p-6">
        <button
          onClick={onClick}
          className="flex items-center justify-center mr-6 lg:hidden"
          type="button"
          aria-label="Back to"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <Avatar
          textImage={thread.shortName}
          isOnline={thread.isOnline}
          srcImage={thread.avatar}
        />
        <div className="flex flex-col ml-4">
          <span className="font-bold text-xl">{thread.name}</span>
          <span className="text-xs text-gray-400">12 member, 5 online</span>
        </div>
        <div className="flex items-center space-x-6 ml-auto text-gray-400">
          <button className="w-5 h-5" type="button" aria-label="Video call">
            <VideoCameraIcon className="w-full h-full" />
          </button>

          <button className="w-5 h-5" type="button" aria-label="Phone call">
            <PhoneIcon className="w-full h-full" />
          </button>

          <button className="w-5 h-5" type="button" aria-label="Chat settings">
            <ChatBubbleOvalLeftIcon className="w-full h-full" />
          </button>
        </div>
      </div>
      <ChatBody thread={thread} />
      <div className="flex items-center gap-3 p-4">
        <button
          className="shrink-0 text-gray-400"
          type="button"
          aria-label="Add media to message"
        >
          <PlusCircleIcon className="w-6 h-6" />
        </button>
        <div className="relative flex w-full max-h-24 overflow-hidden">
          <div
            className="w-full outline-0"
            contentEditable="true"
            tabIndex="0"
            dir="ltr"
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          >
            {"Type your message here..."}
          </div>
        </div>
        <button
          className="flex items-center justify-center shrink-0 w-12 h-12 bg-nav rounded-full overflow-hidden"
          type="button"
          aria-label="Submit"
        >
          <ArrowRightIcon className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
