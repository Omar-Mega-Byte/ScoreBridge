import { create } from 'zustand';
import { authService } from '../services';

const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: authService.isAuthenticated(),

  login: async (credentials) => {
    const response = await authService.login(credentials);
    if (response.success) {
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      });
    }
    return response;
  },

  logout: async () => {
    await authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  register: async (userData) => {
    const response = await authService.register(userData);
    return response;
  },

  updateUser: (userData) => {
    set({ user: userData });
    localStorage.setItem('user', JSON.stringify(userData));
  },
}));

export default useAuthStore;
