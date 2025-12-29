"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { SpinnerWheel } from "../components/game/SpinnerWheel"
import { ResultDisplay } from "../components/game/ResultDisplay"
import type { GameResult, Category } from "../types"
import { LoadingSpinner } from "../components/ui/LoadingSpinner"
import { getSpinnerCategories } from "../api/categoryApi"
import { useToast } from "../components/ui/Toast"

export const GamePage: React.FC = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<GameResult | null>(null)
  const [spinCount, setSpinCount] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const fetchSpinnerCategories = async () => {
      setIsLoading(true)
      try {
        const response = await getSpinnerCategories()
        const mappedCategories: Category[] = response.categories.map((cat) => ({
          id: cat.id,
          name: cat.title,
          description: cat.description,
          color: cat.color,
          imageUrl: cat.image,
          icon: "star",
          createdAt: cat.createdAt || new Date().toISOString(),
          updatedAt: cat.updatedAt || new Date().toISOString(),
        }))
        setCategories(mappedCategories)
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to fetch spinner categories"
        toast(errorMessage, "error")
        console.error("Error fetching spinner categories:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpinnerCategories()
  }, [])

  const handleSegmentSelect = (category: any) => {
    setSpinCount((prev) => prev + 1)
    const newResult = {
      categoryId: category.id,
      categoryName: category.name,
      categoryImage: category.imageUrl,
      categoryColor: category.color,
      timestamp: new Date().toISOString(),
      spins: spinCount + 1,
    }
    setResult(newResult)

    // Show result after a short delay for animation
    setTimeout(() => {
      setShowResult(true)
    }, 500)
  }

  const handlePlayAgain = () => {
    setShowResult(false)
    setResult(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="w-full px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex justify-center items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl border border-blue-400/30 shadow-lg">
              <span className="logo-spin text-2xl">🎡</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Spin<span className="text-sky-400">Wheel</span>
            </h1>
          </div>

          {token ? (
            <button
              onClick={() => navigate("/admin")}
              className="rounded-lg border-0 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
            >
              ⚙️ Admin Panel
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg border-0 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
            >
              🔐 Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-6">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="w-full max-w-6xl">
            {/* Show either Spinner or Result */}
            <div className="relative">
              {!showResult ? (
                <div className="animate-fadeIn">
                  <SpinnerWheel
                    categories={categories}
                    onSegmentSelect={handleSegmentSelect}
                  />
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <ResultDisplay
                    result={result}
                    onPlayAgain={handlePlayAgain}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
