"use client"

import React, { useState } from "react"
import { forgotPassword as forgotPasswordApi } from "../../api/authApi"
import { useToast } from "../ui/Toast"
import { LoadingSpinner } from "../ui/LoadingSpinner"

interface Props {
    onForgotSuccess?: (email: string) => void
    onCancel?: () => void
    title?: string
}

export const ForgotPasswordForm: React.FC<Props> = ({ onForgotSuccess, onCancel, title }) => {
    const toast = useToast()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await forgotPasswordApi({ email })
            const isSuccess = response?.status === "SUCCESS"
            if (isSuccess) {
                const returnedEmail = email || response?.data?.email || response?.email
                toast("OTP sent to your email", "success")
                onForgotSuccess?.(returnedEmail)
            } else {
                throw new Error(response.message || "Failed to start forgot password flow")
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to start forgot password flow"
            toast(errorMessage, "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <h2 className="text-2xl text-center font-semibold text-white/90 mb-4">{title ?? "Reset your password"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white/80">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 py-2.5 font-semibold text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 mt-6 border-0"
                >
                    {isLoading ? <LoadingSpinner size="sm" /> : null}
                    {isLoading ? "Sending..." : "Send OTP"}
                </button>


            </form >

            <div className="mt-4 text-center text-sm text-white/70">
                <button type="button" onClick={onCancel} className="text-blue-300 hover:underline bg-transparent border-0">Back to login</button>
            </div>
        </>
    )
}
