"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { Modal } from "../ui/Modal"

export const Header: React.FC = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [isLogoutConfirming, setIsLogoutConfirming] = useState<boolean>(false)

  const handleLogout = () => {
    setIsLogoutConfirming(true)
  }

  const confirmLogout = () => {
    setIsLogoutConfirming(false)
    logout()
    navigate("/login")
  }

  return (
    <>
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex justify-center items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl border border-blue-400/30 shadow-lg">
              <span className="logo-spin text-2xl">🎡</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Spin<span className="text-sky-400">Wheel</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {token && user && (
              <>
                <span className="text-sm text-white/70 font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600/90 border-0 bg-blue-500/90"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

      </header>
      <Modal isOpen={isLogoutConfirming} onClose={() => setIsLogoutConfirming(false)} title="Confirm Logout">
        <div className="flex flex-col gap-4">
          <p className="text-gray-600  text-sm">Are you sure you want to logout? You will need to login again to access the admin panel.</p>

          <div className="flex gap-2">
            <button
              onClick={confirmLogout}
              className="flex-1 rounded-lg bg-red-500/80 py-2 font-medium text-white hover:bg-red-600 border-0"
            >
              Logout
            </button>
            <button
              onClick={() => setIsLogoutConfirming(false)}
              className="flex-1 rounded-lg font-semibold py-2.5 border-0 text-gray-700 bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
