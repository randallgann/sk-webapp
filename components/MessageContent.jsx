export default function MessageContent({
  currentUser,
  index,
  padding = true,
  children,
  isTyping = false
}) {
  const styles = {
    tail: currentUser ? 'rounded-tr-none' : 'rounded-tl-none',
    background: currentUser ? 'bg-nav text-white' 
    : isTyping
      ? 'bg-message text-gray-600 animate-pulse'
      : 'bg-message',
  };

  return (
    <div
      className={`
        max-w-[85%] 
        md:max-w-md 
        p-2 sm:p-3 ms:p-4 
        rounded-2xl 
        overflow-hidden 
        whitespace-pre-wrap 
        break-words
        text-sm leading-5
        md: text-base md:leading-6
        ${index === 0 && styles.tail} 
        ${styles.background}`}
    >
      {children}
    </div>
  );
}
