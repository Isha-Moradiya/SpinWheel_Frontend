"use client"

import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

export const Sidebar: React.FC = () => {
  const { token } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  if (!token) return null

  return (
    <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl p-4">
      <nav className="space-y-2">
        <Link
          to="/admin"
          className={`block no-underline rounded-lg px-4 py-2 font-medium transition-colors ${isActive("/admin") ? "bg-blue-500/20 text-blue-300" : "text-white/70 hover:text-white"
            }`}
        >
          Manage Category
        </Link>
      </nav>
    </aside>
  )
}
