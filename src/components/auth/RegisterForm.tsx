"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "../ui/Toast"
import { LoadingSpinner } from "../ui/LoadingSpinner"
import { register as registerApi } from "../../api/authApi"
import { Eye, EyeOff } from "lucide-react"

interface RegisterFormProps {
  onRegisterSuccess?: (email: string) => void
  onSwitchToLogin?: () => void
  title?: string
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin, title }) => {
  const toast = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast("Passwords don't match", "error")
      return
    }

    setIsLoading(true)
    try {
      const response = await registerApi({ name, email, password })
      const isSuccess = response?.status === "SUCCESS"

      if (isSuccess) {
        toast("Registration successful! Please verify your email.", "success")
        const returnedEmail = email || response?.data?.email || response?.email
        onRegisterSuccess?.(returnedEmail)
      } else {
        throw new Error(response.message || "Registration failed")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Registration failed"
      toast(errorMessage, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-2xl text-center font-semibold text-white/90 mb-4">{title ?? "Create your account"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
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
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 pr-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-2 top-5 -translate-y-1/2 text-white/80 border-0 bg-transparent"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 py-2.5 font-semibold text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 mt-6 border-0"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : null}
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-white/70">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-blue-300 hover:underline bg-transparent border-0">Login</button>
      </div>
    </>
  )
}
