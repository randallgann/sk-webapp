// /utils/apiService.js
import axios from 'axios';
import { mapChatSessionToThread, mapThreadToChatSession } from './chatMappers';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*'
  },
  maxRedirects: 0
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🌐 API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response.data;  // Return the data directly
  },
  (error) => {
    console.error('❌ Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    return Promise.reject(error);
  }
);

export const ThreadService = {

  async getThreadMessages(threadId, skip=0, count=100) {
    try {
      const response = await api.get(`/chats/${threadId}/messages`, {
        params: { skip, count }
      });

      if (!response) {
        throw new Error('No response from server');
      }
      return (response || []).map(message => ({
        id: message.id,
        content: message.content,
        isCurrentUser: message.authorRole === 0, // assuming 0 means user message
        timestamp: message.timestamp,
        userId: message.userId,
        userName: message.userName
      }));
    } catch (error) {
      // If it's a 404, return empty array instead of throwing
      if (error.response?.status === 404) {
        return [];
      }
      console.error('Error fetching thread messages:', error);
      throw error;
    }
  },

    // Add a method to load all messages
  async getAllThreadMessages(threadId) {
    try {
      let allMessages = [];
      let skip = 0;
      const batchSize = 100;
      
      while (true) {
        const batch = await this.getThreadMessages(threadId, skip, batchSize);
        if (!batch || batch.length === 0) {
          break;
        }
        
        allMessages = [...allMessages, ...batch];
        
        if (batch.length < batchSize) {
          break;
        }
        
        skip += batchSize;
      }
      
      return allMessages;
    } catch (error) {
      console.error('Error fetching all messages:', error);
      throw error;
    }
  },

  async getAllThreads() {
    try {
      const response = await api.get('/chats');
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
      }
      
      // Map each chat session to thread format
      return response.map(chatSession => 
        mapChatSessionToThread(chatSession, null)
      );
    } catch (error) {
      console.error('Error fetching all threads:', error);
      throw error;
    }
  },

  async sendMessage(threadId, messageContent) {
    try {
        console.log('📤 Sending message to thread:', threadId, messageContent);

        const response = await api.post(`/chats/${threadId}/messages`, {
            variables: [{"key": "messageType", "value": "message"}],
            input: messageContent
        });

        console.log('📥 Received message response:', response);

        if (!response || !response.variables) {
            throw new Error('No response from server');
        }

        return response;

    } catch (error) {
        console.error('💥 Error sending message:', error);
        throw error;
    }
},

  async createThread(threadData) {
    try {
      console.log('📤 Creating new thread with data:', threadData);
      
      const chatSessionData = mapThreadToChatSession(threadData);
      console.log('🔄 Mapped to chat session format:', chatSessionData);
      
      const chatResponse = await api.post('/chats', chatSessionData);
      console.log('📥 Received chat session response:', chatResponse);

      // Check if we have a valid response with chatSession
      if (!chatResponse || !chatResponse.chatSession) {
        console.error('Invalid response structure:', chatResponse);
        throw new Error('Server returned invalid data structure');
      }
      
      // Map the response using both chatSession and initialBotMessage
      const thread = mapChatSessionToThread(
        chatResponse.chatSession,
        null,
        chatResponse.initialBotMessage
      );

      console.log('🔄 Mapped to thread format:', thread);
      
      return thread;

    } catch (error) {
      console.error('💥 Error creating thread:', error);
      throw error;
    }
  },

  async deleteThread(threadId) {
    try {
      const response = await api.delete(`/chats/${threadId}`);
      return response;
    } catch (error) {
      console.error('Error deleting thread:', error);
      throw error;
    }
  },

  async updateThread(threadId, threadData) {
    try {
      const chatSessionData = mapThreadToChatSession(threadData);
      const response = await api.put(`/chats/${threadId}`, chatSessionData);
      return mapChatSessionToThread(response.chatSession, response.initialBotMessage);
    } catch (error) {
      console.error('Error updating thread:', error);
      throw error;
    }
  },

  async getThread(threadId) {
    try {
      const response = await api.get(`/chats/${threadId}`);
      
      // For GET requests, the response might be just the chatSession
      if (!response) {
        throw new Error('No response from server');
      }

      // Handle both nested and direct response formats
      const chatSession = response.chatSession || response;
      const initialBotMessage = response.initialBotMessage;

      return mapChatSessionToThread(chatSession, initialBotMessage);
    } catch (error) {
      console.error('Error fetching thread:', error);
      throw error;
    }
  },

  // New method for suggested questions
  async getSuggestedQuestions() {
    try {
      const response = await api.get('api/SuggestedQuestions/all');
      
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
      }

      // Flatten all questions from all objects
      const allQuestions = response.flatMap(item => 
        (item.questions || []).map(content => ({
          id: `${item.id}-${content}`, // Create a unique ID for each question
          content: content
        }))
      );

      return allQuestions;
    } catch (error) {
      console.error('Error fetching suggested questions:', error);
      throw error;
    }
  }
};