"use client"

import type React from "react"
import { useAuth } from "../hooks/useAuth"
import { Header } from "../components/layout/Header"
import { CategoryList } from "../components/admin/CategoryList"

export const AdminPage: React.FC = () => {
  const { token } = useAuth()

  if (!token) {
    return <div>Please log in first</div>
  }

  return (
    <div className="h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16">
        <Header />
      </header>

      {/* Scrollable Content */}
      <main className="pt-16 h-full overflow-y-auto">
        <div className="p-8">
          <CategoryList />
        </div>
      </main>
    </div>

  )
}
