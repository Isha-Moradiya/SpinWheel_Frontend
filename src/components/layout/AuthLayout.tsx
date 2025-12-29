"use client"

import type React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl border border-blue-400/30 shadow-lg">
              <span className="logo-spin text-3xl">🎡</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-wide">
            Spin<span className="text-sky-400">Wheel</span>
          </h1>

          <p className="mt-2 text-white/60 text-sm">
            Spin to win amazing categories
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  )
}
