import { api } from "../lib/api-client";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Login API
export const login = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data, config);
  return response.data;
};

// Register API
export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register", data, config);
  return response.data;
};

// Verify OTP API
export const verifyOTP = async (data: { email: string; otp: string }) => {
  const response = await api.post("/auth/verify-otp", data, config);
  return response.data;
};

// Resend OTP API
export const resendOTP = async (data: { email: string }) => {
  const response = await api.post("/auth/resend-otp", data, config);
  return response.data;
};

// Forgot Password API
export const forgotPassword = async (data: { email: string }) => {
  const response = await api.post("/auth/forgot-password", data, config);
  return response.data;
};

// Reset Password API
export const resetPassword = async (data: {
  email: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await api.post("/auth/reset-password", data, config);
  return response.data;
};

// Get Current User API
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};


