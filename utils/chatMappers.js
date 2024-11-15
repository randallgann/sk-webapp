// /utils/chatMappers.js
export const mapChatSessionToThread = (chatSession, initialBotMessage) => {
  return {
    id: chatSession.id,
    name: chatSession.title,
    isOnline: true,
    shortName: chatSession.title.charAt(0).toUpperCase(),
    isReaded: true,
    lastMessage: initialBotMessage?.content || "New conversation started",
    time: new Date(chatSession.createdOn).toLocaleTimeString(),
    messages: initialBotMessage ? [
      {
        id: initialBotMessage.id,
        content: initialBotMessage.content,
        timestamp: initialBotMessage.timestamp,
        isCurrentUser: false,
        userName: initialBotMessage.userName
      }
    ] : [],
    // Keep the original data in case we need it later
    _originalChatSession: chatSession
  };
};

export const mapThreadToChatSession = (thread) => {
  return {
    title: thread.name
  };
};