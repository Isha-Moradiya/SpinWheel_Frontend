"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthLayout } from "../components/layout/AuthLayout"
import { LoginForm } from "../components/auth/LoginForm"
import { RegisterForm } from "../components/auth/RegisterForm"
import { OTPVerification } from "../components/auth/OTPVerification"
import { ForgotPasswordForm } from "../components/auth/ForgotPasswordForm"
import { ResetPasswordForm } from "../components/auth/ResetPasswordForm"

export const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const [view, setView] = useState<"login" | "register" | "forgot" | "otp" | "reset">("login")
  const [pendingEmail, setPendingEmail] = useState<string>("")
  const [otpFlow, setOtpFlow] = useState<"register" | "forgot">("register")
  const [resetToken, setResetToken] = useState<string | null>(null)

  // Start OTP verification flow (from register or forgot password)
  const startOtpFlow = (email: string, flow: "register" | "forgot") => {
    setPendingEmail(email)
    setOtpFlow(flow)
    setView("otp")
  }

  // After OTP verification
  const handleOtpVerified = (data?: any) => {
    // If coming from register flow, go to admin
    if (otpFlow === "register") {
      setPendingEmail("")
      navigate("/admin")
      return
    }

    // If forgot flow, expect a reset token in response data
    if (otpFlow === "forgot") {
      const token = data?.resetToken || data?.token || null
      setResetToken(token)
      setView("reset")
      return
    }
  }

  // After reset password success, navigate to login
  const handleResetSuccess = () => {
    navigate("/login")
    setView("login")
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {view === "login" && (
          <LoginForm
            title="Sign in"
            onLoginSuccess={() => navigate("/admin")}
            onSwitchToRegister={() => setView("register")}
            onForgotPassword={() => setView("forgot")}
          />
        )}

        {view === "register" && (
          <RegisterForm
            title="Create account"
            onRegisterSuccess={(email) => startOtpFlow(email, "register")}
            onSwitchToLogin={() => setView("login")}
          />
        )}

        {view === "forgot" && (
          <ForgotPasswordForm
            title="Forgot password"
            onForgotSuccess={(email: any) => startOtpFlow(email, "forgot")}
            onCancel={() => setView("login")}
          />
        )}

        {view === "otp" && pendingEmail && (
          <OTPVerification
            title={otpFlow === 'register' ? 'Verify your email' : 'Enter reset code'}
            email={pendingEmail}
            flow={otpFlow}
            onVerificationSuccess={(data?: any) => handleOtpVerified(data)}
          />
        )}

        {view === "reset" && (
          <ResetPasswordForm
            title="Choose a new password"
            email={pendingEmail}
            token={resetToken}
            onResetSuccess={handleResetSuccess}
          />
        )}
      </div>
    </AuthLayout>
  )
}
