import axios from "axios";
import { env } from "../config/env";
import { encrypt, decrypt } from "../lib/encryption-utils";

// Optionally, use encrypted tokens in localStorage
const TOKEN_KEY = "token";

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, encrypt(token));
};

export const getToken = (): string | null => {
  const encrypted = localStorage.getItem(TOKEN_KEY);
  if (!encrypted) return null;
  return decrypt(encrypted);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("role");
};

export const api = axios.create({
  baseURL: env.API_URL,
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Logout on invalid token or 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.data?.message?.toLowerCase().includes("invalid token"))
    ) {
      clearAuthStorage();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);
