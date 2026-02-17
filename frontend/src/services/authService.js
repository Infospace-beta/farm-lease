import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';
import { jwtDecode } from 'jwt-decode';

const authService = {
  // Decode JWT and extract user info
  decodeToken: (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Login
  login: async (email, password, rememberMe = false) => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });

    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      const decodedToken = authService.decodeToken(response.data.access);
      const user = response.data.user || (decodedToken
        ? {
            id: decodedToken.user_id,
            email: decodedToken.email,
            role: decodedToken.role,
            is_staff: decodedToken.is_staff,
            username: decodedToken.username,
          }
        : null);

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
    }

    return response.data;
  },

  // Register
  register: async (userData) => {
    // Map frontend field names to backend field names
    const backendData = {
      username: userData.name,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phone,
      role: userData.role // Already mapped to backend values in constants
    };
    console.log('Sending registration data:', backendData);
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, backendData);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post(API_ENDPOINTS.LOGOUT, { refresh: refreshToken });
      }
    } finally {
      authService.clearSession();
      // Dispatch logout event for other tabs
      window.dispatchEvent(new Event('auth-logout'));
    }
  },

  // Refresh access token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN, {
      refresh: refreshToken,
    });

    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      const decodedToken = authService.decodeToken(response.data.access);
      if (decodedToken) {
        const user = authService.getCurrentUser() || {};
        const mergedUser = {
          ...user,
          id: decodedToken.user_id,
          email: decodedToken.email,
          role: decodedToken.role,
          is_staff: decodedToken.is_staff,
          username: decodedToken.username,
        };
        localStorage.setItem('user', JSON.stringify(mergedUser));
      }
      return response.data.access;
    }

    throw new Error('Failed to refresh token');
  },

  // Clear session data
  clearSession: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
  },

  // Get current user from localStorage or decode from token
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    
    // If no user in localStorage, try to decode from token
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = authService.decodeToken(token);
      if (decodedToken) {
        return {
          id: decodedToken.user_id,
          email: decodedToken.email,
          role: decodedToken.role,
          is_staff: decodedToken.is_staff,
          username: decodedToken.username,
        };
      }
    }
    
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Get user role
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  },

  // Update user data in localStorage
  updateUser: (userData) => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  },

  // Check if user is staff/admin
  isStaff: () => {
    const user = authService.getCurrentUser();
    return user?.is_staff || false;
  },
};

export default authService;
