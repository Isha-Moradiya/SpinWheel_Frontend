"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useToast } from "../ui/Toast"
import { LoadingSpinner } from "../ui/LoadingSpinner"
import { verifyOTP as verifyOTPApi, resendOTP as resendOTPApi } from "../../api/authApi"

interface OTPVerificationProps {
  email: string
  flow?: "register" | "forgot"
  onVerificationSuccess?: (data?: any) => void
}

const OTP_LENGTH = 6

export const OTPVerification: React.FC<OTPVerificationProps & { title?: string }> = ({ email, flow = "register", onVerificationSuccess, title }) => {
  const { setToken, setEmail } = useAuth()
  const toast = useToast()
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [resendTimer, setResendTimer] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const otpValue = otp.join("")


  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)

    if (!pasted) return

    const newOtp = Array(OTP_LENGTH).fill("")
    pasted.split("").forEach((digit, i) => {
      newOtp[i] = digit
    })

    setOtp(newOtp)

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.length !== 6) {
      toast("OTP must be 6 digits", "error")
      return
    }

    setIsLoading(true)
    try {
      const response = await verifyOTPApi({ email, otp: otpValue })
      const isSuccess = response?.status === "SUCCESS"

      if (isSuccess) {
        // If register flow and backend returned token+user, set them
        if (flow === "register" && response.data && response.data.token && response.data.user) {
          const { token, user } = response.data
          setToken(token, user)
          setEmail(email)
          toast("Email verified successfully!", "success")
          onVerificationSuccess?.(response.data)
          return
        }

        // For register flow without token, still proceed and let parent navigate
        if (flow === "register") {
          toast("Email verified successfully!", "success")
          onVerificationSuccess?.(response.data)
          return
        }

        // Forgot flow: backend may return a reset token or other data
        toast("Verification successful", "success")
        onVerificationSuccess?.(response.data)
      } else {
        throw new Error(response.message || "OTP verification failed")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Invalid OTP"
      toast(errorMessage, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      const response = await resendOTPApi({ email })
      if (response.success) {
        toast("OTP resent to your email", "success")
        setResendTimer(60)
      } else {
        throw new Error(response.message || "Failed to resend OTP")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to resend OTP"
      toast(errorMessage, "error")
    }
  }

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-4">
      <h2 className="text-2xl text-center font-semibold text-white/90 mb-4">{title ?? "Enter verification code"}</h2>
      <p className="text-sm text-white/70">We've sent a 6-digit code to {email}</p>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Verification Code</label>
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-14 w-12 rounded-xl border border-white/20 bg-white/10 text-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || otp.length !== 6}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 py-2.5 font-semibold text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 mt-4 border-0"
      >
        {isLoading ? <LoadingSpinner size="sm" /> : null}
        {isLoading ? "Verifying..." : "Verify Email"}
      </button>

      <button
        type="button"
        onClick={handleResend}
        disabled={resendTimer > 0}
        className="text-blue-300 hover:underline bg-transparent border-0"
      >
        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
      </button>
    </form>
  )
}
