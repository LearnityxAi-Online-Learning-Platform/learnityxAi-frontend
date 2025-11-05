// src/store/hooks/useAuthHook.ts
import { useAppDispatch, useAppSelector } from './useReduxHooks';
import {
  register,
  login,
  getUserProfile,
  updateProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
  deleteAccount,
  logout,
  clearError,
  clearAuth,
} from '../slices/authSlice';
import {
  RegisterPayload,
  LoginPayload,
  ForgotPasswordPayload,
  VerifyOTPPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  DeleteAccountPayload,
  LogoutPayload,
} from '../types/authTypes';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const handleRegister = async (payload: RegisterPayload) => {
    return await dispatch(register(payload)).unwrap();
  };

  const handleLogin = async (payload: LoginPayload) => {
    return await dispatch(login(payload)).unwrap();
  };

  const handleGetUserProfile = async () => {
    return await dispatch(getUserProfile()).unwrap();
  };

  const handleUpdateProfile = async (payload: UpdateProfilePayload) => {
    return await dispatch(updateProfile(payload)).unwrap();
  };

  const handleForgotPassword = async (payload: ForgotPasswordPayload) => {
    return await dispatch(forgotPassword(payload)).unwrap();
  };

  const handleVerifyOTP = async (payload: VerifyOTPPayload) => {
    return await dispatch(verifyOTP(payload)).unwrap();
  };

  const handleResetPassword = async (payload: ResetPasswordPayload) => {
    return await dispatch(resetPassword(payload)).unwrap();
  };

  const handleDeleteAccount = async (payload: DeleteAccountPayload) => {
    return await dispatch(deleteAccount(payload)).unwrap();
  };

  const handleLogout = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken) {
      return await dispatch(logout({ refreshToken })).unwrap();
    } else {
      dispatch(clearAuth());
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleClearAuth = () => {
    dispatch(clearAuth());
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    loading,
    error,
    register: handleRegister,
    login: handleLogin,
    getUserProfile: handleGetUserProfile,
    updateProfile: handleUpdateProfile,
    forgotPassword: handleForgotPassword,
    verifyOTP: handleVerifyOTP,
    resetPassword: handleResetPassword,
    deleteAccount: handleDeleteAccount,
    logout: handleLogout,
    clearError: handleClearError,
    clearAuth: handleClearAuth,
  };
};
