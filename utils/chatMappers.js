// /utils/chatMappers.js
export const mapChatSessionToThread = (chatSession, messages = [], initialBotMessage = null) => {
  console.log('Mapping chat session to thread:', chatSession);
  console.log('Initial bot message', initialBotMessage);

  if (!chatSession) {
    console.error('Received null or undefined chatSession');
    throw new Error('Cannot map null chat session');
  }

   // Ensure we have an ID
  if (!chatSession.id) {
    console.error('Chat session missing required id:', chatSession);
    throw new Error('Chat session missing required id');
  }

  // First create the initial message if it exists in the creation response
    let initialMessage = initialBotMessage ? [{
        id: initialBotMessage.id,
        content: initialBotMessage.content,
        timestamp: initialBotMessage.timestamp,
        isCurrentUser: false,
        userName: initialBotMessage.userName,
        authorRole: initialBotMessage.authorRole
    }] : [];

  // Map any additional messages
    const additionalMessages = Array.isArray(messages) ? messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.timestamp,
        isCurrentUser: msg.authorRole === 'User',
        userName: msg.userName,
        authorRole: msg.authorRole
    })) : [];

    // Combine messages with initial message first
    const allMessages = [...initialMessage, ...additionalMessages];

   const thread = {
    id: chatSession.id,
    name: chatSession.title || 'New Chat',
    isOnline: true,
    shortName: (chatSession.title || 'N').charAt(0).toUpperCase(),
    isReaded: true,
    lastMessage: allMessages.length > 0 ? 
            allMessages[allMessages.length - 1].content : 
            "New conversation started",
    time: new Date(chatSession.createdOn).toLocaleTimeString(),
    messages: allMessages,
    systemDescription: chatSession.systemDescription,
    safeSystemDescription: chatSession.safeSystemDescription,
    enabledPlugins: chatSession.enabledPlugins || [],
    memoryBalance: chatSession.memoryBalance || 0.5,
    version: chatSession.version || "2.0",
    isBookmarked: chatSession.isBookmarked || false,
    _originalChatSession: chatSession
  };

  console.log('Created thread object:', thread);
  return thread;
};

export const mapThreadToChatSession = (thread) => {
  // When creating a new thread, we only need to send the title
  return {
    title: thread.name || 'New Chat',
    enabledPlugins: [],
    memoryBalance: 0.5,
    version: "2.0"
  };
};