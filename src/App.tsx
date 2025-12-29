"use client"

import type React from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { useEffect, useState } from "react"

import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { ErrorBoundary } from "./components/ui/ErrorBoundary"
import { ToastContainer } from "./components/ui/Toast"

import { AuthPage } from "./pages/AuthPage"
import { GamePage } from "./pages/GamePage"
import { AdminPage } from "./pages/AdminPage"
import { useSpinnerCategories } from "./hooks/useSpinnerCategories"
import { useAuth } from "./hooks/useAuth"
import { LoadingSpinner } from "./components/ui/LoadingSpinner"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth()

  // Wait for auth state to load
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <LoadingSpinner />
      </div>
    )
  }

  // Check if authenticated - verify token exists
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AppContent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
    )
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route path="/game" element={<GamePage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<HomeRedirect />}
        />
      </Routes>

      <ToastContainer />
    </>
  )
}

function HomeRedirect() {
  const { categories, isLoading } = useSpinnerCategories()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <LoadingSpinner />
      </div>
    )
  }

  if (categories && categories.length > 0) {
    return <Navigate to="/game" replace />
  }

  return <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </Router>
  )
}

export default App
