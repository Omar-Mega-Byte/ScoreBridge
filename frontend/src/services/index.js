import api from './api';

// ==================== AUTHENTICATION ====================
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// ==================== CREDIT SCORING ====================
export const scoringService = {
  calculateScore: async (financialData) => {
    const response = await api.post('/score/calculate', financialData);
    return response.data;
  },

  getScoreHistory: async (userId) => {
    const response = await api.get(`/score/history/${userId}`);
    return response.data;
  },

  getLatestScore: async (userId) => {
    const response = await api.get(`/score/latest/${userId}`);
    return response.data;
  },

  checkHealth: async () => {
    const response = await api.get('/score/health');
    return response.data;
  }
};

// ==================== DATA INGESTION ====================
export const dataIngestionService = {
  // Financial Profile
  createFinancialProfile: async (profileData) => {
    const response = await api.post('/data-ingestion/financial-profile', profileData);
    return response.data;
  },

  getFinancialProfile: async (userId) => {
    const response = await api.get(`/data-ingestion/financial-profile/${userId}`);
    return response.data;
  },

  updateFinancialProfile: async (userId, profileData) => {
    const response = await api.put(`/data-ingestion/financial-profile/${userId}`, profileData);
    return response.data;
  },

  // Financial Accounts
  createAccount: async (accountData) => {
    const response = await api.post('/data-ingestion/accounts', accountData);
    return response.data;
  },

  getUserAccounts: async (userId) => {
    const response = await api.get(`/data-ingestion/accounts/user/${userId}`);
    return response.data;
  },

  getAccountById: async (accountId) => {
    const response = await api.get(`/data-ingestion/accounts/${accountId}`);
    return response.data;
  },

  updateAccount: async (accountId, accountData) => {
    const response = await api.put(`/data-ingestion/accounts/${accountId}`, accountData);
    return response.data;
  },

  deleteAccount: async (accountId) => {
    const response = await api.delete(`/data-ingestion/accounts/${accountId}`);
    return response.data;
  },

  // Transactions
  createTransaction: async (transactionData) => {
    const response = await api.post('/data-ingestion/transactions', transactionData);
    return response.data;
  },

  getAccountTransactions: async (accountId) => {
    const response = await api.get(`/data-ingestion/transactions/account/${accountId}`);
    return response.data;
  },

  getUserTransactions: async (userId) => {
    const response = await api.get(`/data-ingestion/transactions/user/${userId}`);
    return response.data;
  },

  getTransactionById: async (transactionId) => {
    const response = await api.get(`/data-ingestion/transactions/${transactionId}`);
    return response.data;
  }
};

// ==================== USER MANAGEMENT ====================
export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  }
};

export default {
  auth: authService,
  scoring: scoringService,
  dataIngestion: dataIngestionService,
  user: userService
};
