// /utils/apiService.js
import axios from 'axios';
import { mapChatSessionToThread, mapThreadToChatSession } from './chatMappers';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*'
  }
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
    return response.data;
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
  async createThread(threadData) {
    try {
      console.log('📤 Creating new thread with data:', threadData);
      
      const chatSessionData = mapThreadToChatSession(threadData);
      console.log('🔄 Mapped to chat session format:', chatSessionData);
      
      const response = await api.post('/chats', chatSessionData);
      console.log('📥 Received chat session response:', response);
      
      const thread = mapChatSessionToThread(
        response.chatSession,
        response.initialBotMessage
      );
      console.log('🔄 Mapped back to thread format:', thread);
      
      return thread;
    } catch (error) {
      console.error('💥 Error creating thread:', {
        error,
        originalData: threadData,
        config: error.config
      });
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
      return mapChatSessionToThread(response.chatSession);
    } catch (error) {
      console.error('Error updating thread:', error);
      throw error;
    }
  },

  async getThread(threadId) {
    try {
      const response = await api.get(`/chats/${threadId}`);
      return mapChatSessionToThread(response.chatSession);
    } catch (error) {
      console.error('Error fetching thread:', error);
      throw error;
    }
  }

};