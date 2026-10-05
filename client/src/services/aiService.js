import { api } from './api';

export const aiService = {
  /**
   * Generate custom AI typing passage from topic & difficulty
   */
  generateText: async ({ topic, difficulty = 'medium', wordCount = 50 }) => {
    try {
      const response = await api.post('/ai/generate', { topic, difficulty, wordCount });
      return response.data || response;
    } catch (error) {
      console.error('[AI Service Error - generateText]:', error);
      throw error;
    }
  },

  /**
   * Generate targeted weak key drill
   */
  generateWeakKeyDrill: async ({ weakKeys = [], wordCount = 35 }) => {
    try {
      const response = await api.post('/ai/weak-key-drill', { weakKeys, wordCount });
      return response.data || response;
    } catch (error) {
      console.error('[AI Service Error - generateWeakKeyDrill]:', error);
      throw error;
    }
  },

  /**
   * Generate code typing snippet
   */
  generateCodeSnippet: async ({ language = 'javascript', topic = 'algorithms' }) => {
    try {
      const response = await api.post('/ai/code-snippet', { language, topic });
      return response.data || response;
    } catch (error) {
      console.error('[AI Service Error - generateCodeSnippet]:', error);
      throw error;
    }
  },

  /**
   * Get post-test coaching insights
   */
  getCoachFeedback: async ({ wpm, accuracy, consistency, duration, mistakesCount }) => {
    try {
      const response = await api.post('/ai/coach-feedback', {
        wpm,
        accuracy,
        consistency,
        duration,
        mistakesCount,
      });
      return response.data || response;
    } catch (error) {
      console.error('[AI Service Error - getCoachFeedback]:', error);
      throw error;
    }
  },

  /**
   * Send chat message to AI Typing Coach
   */
  sendChatMessage: async ({ message, history = [] }) => {
    try {
      const response = await api.post('/ai/chat', { message, history });
      return response.data || response;
    } catch (error) {
      console.error('[AI Service Error - sendChatMessage]:', error);
      throw error;
    }
  },
};


