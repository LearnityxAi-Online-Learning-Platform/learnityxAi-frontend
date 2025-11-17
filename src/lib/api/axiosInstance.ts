// src/lib/api/axiosInstance.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { base_url } from '@/config/config';

export const axiosInstance = axios.create({
  baseURL: base_url,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip auto-redirect for auth endpoints
    const authEndpoints = ['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password', '/api/auth/verify-otp', '/api/auth/reset-password'];
    const isAuthEndpoint = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

    // If token expired and we haven't retried yet, and NOT an auth endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');

        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Try to refresh the token
        const response = await axios.post(`${base_url}/api/auth/refresh-token`, {
          refreshToken,
        });

        if (response.data.success) {
          const newAccessToken = response.data.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          Cookies.set('accessToken', newAccessToken, { expires: 1/24 });

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
