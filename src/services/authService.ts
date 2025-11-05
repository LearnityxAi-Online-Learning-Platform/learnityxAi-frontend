// src/store/services/authService.ts
import axiosInstance from '@/lib/api/axiosInstance';
import Cookies from 'js-cookie';
import {
  RegisterPayload,
  LoginPayload,
  ForgotPasswordPayload,
  VerifyOTPPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  DeleteAccountPayload,
  LogoutPayload,
  ApiSuccessResponse,
  AuthResponse,
  RefreshTokenResponse,
  User,
} from '@/types/authTypes';

class AuthService {
  // Register Student or Instructor
  async register(payload: RegisterPayload): Promise<ApiSuccessResponse<AuthResponse>> {
    const response = await axiosInstance.post('/api/auth/register', payload);

    if (response.data.success) {
      // Store tokens in both localStorage and cookies
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      Cookies.set('accessToken', response.data.data.accessToken, { expires: 1/24 }); // 1 hour
      Cookies.set('refreshToken', response.data.data.refreshToken, { expires: 7 }); // 7 days
    }

    return response.data;
  }

  // Login
  async login(payload: LoginPayload): Promise<ApiSuccessResponse<AuthResponse>> {
    const response = await axiosInstance.post('/api/auth/login', payload);

    if (response.data.success) {
      // Store tokens in both localStorage and cookies
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      Cookies.set('accessToken', response.data.data.accessToken, { expires: 1/24 }); // 1 hour
      Cookies.set('refreshToken', response.data.data.refreshToken, { expires: 7 }); // 7 days
    }

    return response.data;
  }

  // Refresh Token
  async refreshToken(refreshToken: string): Promise<ApiSuccessResponse<RefreshTokenResponse>> {
    const response = await axiosInstance.post('/api/auth/refresh-token', { refreshToken });

    if (response.data.success) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      Cookies.set('accessToken', response.data.data.accessToken, { expires: 1/24 }); // 1 hour
    }

    return response.data;
  }

  // Get User Profile
  async getUserProfile(): Promise<ApiSuccessResponse<{ user: User }>> {
    const response = await axiosInstance.get('/api/auth/get-user-profile');

    if (response.data.success && response.data.data.user) {
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return response.data;
  }

  // Update Profile
  async updateProfile(payload: UpdateProfilePayload): Promise<ApiSuccessResponse<{ user: User }>> {
    const response = await axiosInstance.post('/api/auth/update-user-profile', payload);

    if (response.data.success && response.data.data.user) {
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return response.data;
  }

  // Forgot Password
  async forgotPassword(payload: ForgotPasswordPayload): Promise<ApiSuccessResponse<null>> {
    const response = await axiosInstance.post('/api/auth/forgot-password', payload);
    return response.data;
  }

  // Verify OTP
  async verifyOTP(payload: VerifyOTPPayload): Promise<ApiSuccessResponse<null>> {
    const response = await axiosInstance.post('/api/auth/verify-otp', payload);
    return response.data;
  }

  // Reset Password
  async resetPassword(payload: ResetPasswordPayload): Promise<ApiSuccessResponse<null>> {
    const response = await axiosInstance.post('/api/auth/reset-password', payload);
    return response.data;
  }

  // Delete Account
  async deleteAccount(payload: DeleteAccountPayload): Promise<ApiSuccessResponse<null>> {
    const response = await axiosInstance.delete('/api/auth/delete-account', { data: payload });

    if (response.data.success) {
      // Clear all auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }

    return response.data;
  }

  // Logout
  async logout(payload: LogoutPayload): Promise<ApiSuccessResponse<null>> {
    const response = await axiosInstance.post('/api/auth/logout', payload);

    if (response.data.success) {
      // Clear all auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }

    return response.data;
  }

  // Clear local auth data
  clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }
}

export const authService = new AuthService();
export default authService;
