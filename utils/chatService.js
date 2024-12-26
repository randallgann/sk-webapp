// /utils/chatService.js
import { signalRService } from './signalRService';
import { ThreadService } from './apiService';

class ChatService {
    constructor() {
        this.messageHandlers = new Set();
        this.initialized = false;
        this.setupMessageHandler();
    }

    async getThreadMessages(threadId) {
    try {
      const messages = await ThreadService.getThreadMessages(threadId);
      return messages;
    } catch (error) {
      console.error('Error getting thread messages:', error);
      throw error;
    }
  }

    async getAllThreads() {
    try {
      const threads = await ThreadService.getAllThreads();
      return threads;
    } catch (error) {
      console.error('Error getting all threads:', error);
      throw error;
    }
  }

    setupMessageHandler() {
        const initializeInterval = setInterval(() => {
            if (signalRService.isConnected() && !this.initialized) {
                this.initializeMessageHandler();
                this.initialized = true;
                clearInterval(initializeInterval);
            }
        }, 100);

        setTimeout(() => clearInterval(initializeInterval), 10000);
    }

    initializeMessageHandler() {
        const connection = signalRService.getConnection();
        if (!connection) return;

         // Add message update handler
    connection.on("receivemessageupdate", (chatId, messageUpdate) => {
        this.messageHandlers.forEach(handler => {
            handler({
                type: 'messageUpdate',
                chatId,
                ...messageUpdate
            });
        });
    });

        // Listen for bot response status updates
        connection.on("receivebotresponsestatus", (chatId, status) => {
            console.log('Received bot status from SignalR:', { chatId, status }); // Debug log
            this.messageHandlers.forEach(handler => {
                handler({
                    type: 'status',
                    chatId,
                    status
                });
            });
        });

        // Listen for message events
        connection.on("receivemessage", (chatId, senderId, message) => {
            this.messageHandlers.forEach(handler => {
                handler({
                    type: 'message',
                    chatId,
                    senderId,
                    ...message
                });
            });
        });

        // Listen for typing state
        connection.on("receiveuserstate", (chatId, userId, isTyping) => {
            this.messageHandlers.forEach(handler => {
                handler({
                    type: 'typing',
                    chatId,
                    userId,
                    isTyping
                });
            });
        });

        connection.onreconnected(() => {
            console.log('SignalR reconnected, resubscribing to events'); // Debug log
            this.messageHandlers.forEach(handler => {
                connection.on("receivemessage", (chatId, senderId, message) => 
                handler({ type: 'message', chatId, senderId, ...message }));
            connection.on("receivebotresponsestatus", (chatId, status) =>
                handler({ type: 'status', chatId, status }));
            connection.on("receiveuserstate", (chatId, userId, isTyping) => 
                handler({ type: 'typing', chatId, userId, isTyping }));
            connection.on("receivemessageupdate", (chatId, messageUpdate) => 
                handler({ type: 'messageUpdate', chatId, ...messageUpdate }));
            });
        });
    }

    subscribeToMessages(handler) {
        this.messageHandlers.add(handler);
        
        if (signalRService.isConnected()) {
            const connection = signalRService.getConnection();
            if (connection) {
                connection.on("receivemessage", (chatId, senderId, message) => 
                handler({ type: 'message', chatId, senderId, ...message }));
            connection.on("receivebotresponsestatus", (chatId, status) =>
                handler({ type: 'status', chatId, status }));
            connection.on("receiveuserstate", (chatId, userId, isTyping) => 
                handler({ type: 'typing', chatId, userId, isTyping }));
            connection.on("receivemessageupdate", (chatId, messageUpdate) => 
                handler({ type: 'messageUpdate', chatId, ...messageUpdate }));
            }
        }

        return () => {
            this.messageHandlers.delete(handler);
            if (signalRService.isConnected()) {
                const connection = signalRService.getConnection();
                if (connection) {
                    connection.off("receivemessage");
                    connection.off("receivebotresponsestatus");
                    connection.off("receiveuserstate");
                    connection.off("receivemessageupdate"); 
                }
            }
        };
    }

    // Thread management methods using REST API
    async createThread(threadData) {
        const chatSessionData = mapThreadToChatSession(threadData);
        const response = await ThreadService.createThread(chatSessionData);
        return response; // ThreadService already maps the response
    }

    async deleteThread(threadId) {
        return await ThreadService.deleteThread(threadId);
    }

    async updateThread(threadId, threadData) {
        const chatSessionData = mapThreadToChatSession(threadData);
        const response = await ThreadService.updateThread(threadId, chatSessionData);
        return response; // ThreadService already maps the response
    }

    async getThread(threadId) {
    try {
        const thread = await ThreadService.getThread(threadId);
        if (!thread) {
            throw new Error('Thread not found');
        }
        return thread;
    } catch (error) {
        console.error('Error getting thread:', error);
        throw error;
    }
    }

    async joinThread(threadId, existingThread = null) {
        if (!signalRService.isConnected()) {
            throw new Error('SignalR connection is not established');
        }

        const connection = signalRService.getConnection();
        if (!connection) {
            throw new Error('SignalR connection is not available');
        }

        try {
            // Get the thread details
            const thread = existingThread || await this.getThread(threadId);
            
            // Join the SignalR group using the correct method
            await connection.invoke("AddClientToGroupAsync", threadId);
            
            return thread;
        } catch (error) {
            console.error('Error joining thread:', error);
            throw error;
        }
    }

    async leaveThread(threadId) {
        if (!signalRService.isConnected()) {
            throw new Error('SignalR connection is not established');
        }

        const connection = signalRService.getConnection();
        if (!connection) {
            throw new Error('SignalR connection is not available');
        }

        try {
            // Since there's no explicit leave method in the hub,
            // we'll just return true. The connection will be cleaned up
            // when the client disconnects.
            return true;
        } catch (error) {
            console.error('Error leaving thread:', error);
            return false;
        }
    }

    async sendMessage(threadId, messageContent) {
        if (!signalRService.isConnected()) {
            throw new Error('SignalR connection is not established');
        }
        try {
            const response = await ThreadService.sendMessage(threadId, messageContent);
            return response;
        } catch (error) {
            console.error('Failed sending message:', error);
            throw error;
        }
    }
}

export const chatService = new ChatService();
export default chatService;