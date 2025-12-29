"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/api";
import { decrypt, encrypt } from "../lib/encryption-utils";
import { getCurrentUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  email: string | null;
  token: string | null;
  user: User | null;
  role: string | null;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setToken: (token: string, user: User) => void;
  setRole: (role: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmailState] = useState<string | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 🌍 Handle logout from other tabs 
  useEffect(() => {
    const onStorageChange = () => {
      const tokenInStorage = localStorage.getItem("token");
      if (!tokenInStorage) {
        logout();
        navigate("/login");
      }
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, [navigate]);

  // ♻️ Restore session on load
  useEffect(() => {
    const restoreAuth = async () => {
      const storedEmail = decrypt(sessionStorage.getItem("email"));
      const storedToken = decrypt(localStorage.getItem("token"));
      const storedUserRaw = decrypt(localStorage.getItem("user"));
      const storedRole = decrypt(sessionStorage.getItem("role"));

      if (storedEmail) setEmailState(storedEmail);
      if (storedToken) setTokenState(storedToken);

      if (storedUserRaw) {
        try {
          const parsedUser: User = JSON.parse(storedUserRaw);
          setUserState(parsedUser);
          setRole(parsedUser.role ?? null);
        } catch {
          setUserState(null);
          setRole(null);
        }
      } else if (storedToken) {
        try {
          const profile = await getCurrentUser();
          const userData = profile.data?.user || profile.data?.data?.user || profile.data;
          if (userData) {
            setUserState(userData);
            setRole(userData.role ?? null);
            localStorage.setItem("user", encrypt(JSON.stringify(userData)));
          }
        } catch {
          setUserState(null);
          setRole(null);
        }
      } else if (storedRole) {
        setRole(storedRole);
      }

      setIsLoading(false);
    };

    restoreAuth();
  }, []);

  // 🔧 Setters
  const setEmail = (email: string) => {
    sessionStorage.setItem("email", encrypt(email));
    setEmailState(email);
  };

  const setRoleInContext = (role: string) => {
    sessionStorage.setItem("role", encrypt(role));
    setRole(role);
  };

  const setToken = (token: string, user: User) => {
    localStorage.setItem("token", encrypt(token));
    localStorage.setItem("user", encrypt(JSON.stringify(user)));
    setTokenState(token);
    setUserState(user);
    setRole(user.role ?? null);
  };

  // 🔄 Updated setUser function to sync with localStorage
  const setUser = (user: User | null) => {
    if (user) {
      // Update localStorage when user is updated
      localStorage.setItem("user", encrypt(JSON.stringify(user)));
    } else {
      // Remove from localStorage if user is null
      localStorage.removeItem("user");
    }
    setUserState(user);
    setRole(user?.role ?? null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");
    setEmailState(null);
    setTokenState(null);
    setUserState(null);
    setRole(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        token,
        user,
        role,
        isLoading,
        setEmail,
        setToken,
        setRole: setRoleInContext,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
