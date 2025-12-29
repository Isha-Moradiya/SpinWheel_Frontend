"use client"

import React, { useState } from "react"
import { resetPassword as resetPasswordApi } from "../../api/authApi"
import { useToast } from "../ui/Toast"
import { LoadingSpinner } from "../ui/LoadingSpinner"
import { useAuth } from "../../hooks/useAuth"
import { Eye, EyeOff } from "lucide-react"

interface Props {
    email?: string
    token?: string | null
    onResetSuccess?: () => void
    title?: string
}

export const ResetPasswordForm: React.FC<Props> = ({ email, onResetSuccess, title }) => {
    const toast = useToast()
    const { setEmail } = useAuth()
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast("Passwords do not match", "error")
            return
        }

        if (!email) {
            toast("Missing email", "error")
            return
        }

        setIsLoading(true)
        try {
            const response = await resetPasswordApi({ email, newPassword, confirmPassword })
            const isSuccess = response?.status === "SUCCESS"

            if (isSuccess) {
                toast("Password reset successful. Please login.", "success")
                setEmail(email)
                onResetSuccess?.()
            } else {
                throw new Error(response.message || "Reset failed")
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Reset failed"
            toast(errorMessage, "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-2xl text-center font-semibold text-white/90 mb-4">{title ?? "Set a new password"}</h2>
            {email ? <p className="text-sm text-white/70">Resetting password for {email}</p> : null}

            <div>
                <label className="block text-sm font-medium text-white/80">New Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 pr-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                        required
                    />
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60">
                        {showPassword ? (
                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}</button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-white/80">Confirm Password</label>
                <div className="relative">
                    <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 pr-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                        required
                    />
                    <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60">
                        {showConfirm ? (
                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}</button>
                </div>
            </div>

            <button type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 py-2.5 font-semibold text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 mt-4 border-0">
                {isLoading ? <LoadingSpinner size="sm" /> : null}
                {isLoading ? "Resetting..." : "Reset Password"}
            </button>
        </form >
    )
}
