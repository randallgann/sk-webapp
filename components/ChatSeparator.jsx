export default function ChatSeparator({ children }) {
  return (
    <div className="relative shrink-0 my-6 h-px bg-gray-200">
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 uppercase block px-12 bg-chat">
        {children}
      </span>
    </div>
  );
}
