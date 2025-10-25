import axios from 'axios';

const ML_API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000';

console.log('🤖 ML API Configuration:');
console.log('  VITE_ML_API_URL:', import.meta.env.VITE_ML_API_URL);
console.log('  ML_API_BASE_URL:', ML_API_BASE_URL);

const mlApi = axios.create({
  baseURL: ML_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for ML processing
});

/**
 * ML Service - Handles AI/ML related operations
 */
export const mlService = {
  /**
   * Get personalized recommendations based on financial data
   */
  async getRecommendations(data) {
    try {
      const response = await mlApi.post('/recommendations', data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get recommendations',
      };
    }
  },

  /**
   * Simulate what-if scenarios for score changes
   */
  async simulateScore(currentData, changes) {
    try {
      const response = await mlApi.post('/simulate', {
        currentData,
        changes,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to simulate score:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to simulate score',
      };
    }
  },

  /**
   * Analyze spending patterns and get insights
   */
  async analyzeSpending(data) {
    try {
      const response = await mlApi.post('/analyze-spending', data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to analyze spending:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to analyze spending',
      };
    }
  },

  /**
   * Check ML service health
   */
  async healthCheck() {
    try {
      const response = await mlApi.get('/health');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('ML service health check failed:', error);
      return {
        success: false,
        error: error.message || 'ML service is unavailable',
      };
    }
  },
};

export default mlService;
