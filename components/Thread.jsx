import Avatar from "./Avatar";
import ThreadStatus from "./ThreadStatus";

export default function Thread({
  userData,
  isTyping,
  newMessages,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="flex py-3 border-b border-gray-100 hover:bg-gray-100 hover:-mx-6 hover:px-6 transition-all cursor-pointer"
    >
      <Avatar
        textImage={userData?.shortName}
        isOnline={userData?.isOnline}
        srcImage={userData?.avatar}
      />
      <div className="grow pl-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">{userData?.name ?? 'Putri Tanjak'}</span>
          <span className="text-xs text-gray-400 font-medium shrink-0">
            4:30 AM
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          {isTyping ? (
            <span className="text-green-500">Typing...</span>
          ) : (
            <>
              <ThreadStatus readed={userData?.isReaded} newMessages={newMessages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
