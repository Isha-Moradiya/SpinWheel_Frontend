"use client"

// Custom hook for authentication logic
import { useAuth as useAuthContext } from "../context/AuthContext"

export const useAuth = () => {
  return useAuthContext()
}
