"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useToast } from "../ui/Toast"
import { LoadingSpinner } from "../ui/LoadingSpinner"
import { login as loginApi } from "../../api/authApi"
import { Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  onLoginSuccess?: () => void
  onSwitchToRegister?: () => void
  onForgotPassword?: () => void
  title?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister, onForgotPassword, title }) => {
  const { setToken, setUser, setEmail } = useAuth()
  const toast = useToast()
  const [email, setEmailState] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await loginApi({ email, password })
      const isSuccess = response?.status === "SUCCESS"

      if (isSuccess && response.data) {
        const { token, user } = response.data
        setToken(token, user)
        setUser(user)
        setEmail(email)
        toast("Login successful!", "success")
        onLoginSuccess?.()
      } else if (isSuccess) {
        const token = response?.data?.token || response?.token
        const user = response?.data?.user || response?.user
        if (token && user) {
          setToken(token, user)
          setUser(user)
        }
        setEmail(email)
        toast("Login successful!", "success")
        onLoginSuccess?.()
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed"
      toast(errorMessage, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-2xl text-center font-semibold text-white/90 mb-4">{title ?? "Sign in to your account"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmailState(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 pr-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-5 -translate-y-1/2 text-white/80 border-0 bg-transparent"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            <div className="absolute right-0 text-center text-sm text-white/70 mt-1">
              <button type="button" onClick={onForgotPassword} className="text-blue-300 hover:underline bg-transparent border-0">Forgot password?</button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 py-2.5 font-semibold text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 mt-6 border-0"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : null}
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-white/70">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToRegister} className="text-blue-300 hover:underline bg-transparent border-0">Register</button>
      </div>
    </>
  )
}
