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
    padding: padding ? 'p-4' : 'p-0',
  };

  return (
    <div
      className={`max-w-md ${styles.padding} rounded-2xl overflow-hidden ${
        index === 0 && styles.tail
      } ${styles.background}`}
    >
      {children}
    </div>
  );
}
