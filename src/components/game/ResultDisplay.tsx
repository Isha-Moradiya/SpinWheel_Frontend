"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { GameResult } from "../../types"

interface ResultDisplayProps {
  result: GameResult | null
  onPlayAgain?: () => void
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onPlayAgain }) => {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (result) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [result])

  if (!result) return null

  // Generate random confetti
  const confettiColors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f7b731", "#5f27cd", "#00d2d3"]
  const confettiElements = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
  }))

  return (
    <div className="relative flex min-h-[500px] flex-col items-center justify-center px-6 py-12">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confettiElements.map((conf) => (
            <div
              key={conf.id}
              className="absolute animate-confetti"
              style={{
                left: `${conf.left}%`,
                top: "-10%",
                animationDelay: `${conf.delay}s`,
              }}
            >
              <div
                className="h-3 w-3 rotate-45"
                style={{ backgroundColor: conf.color }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Radial Glow Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-linear(circle at center, ${result.categoryColor || "#8b5cf6"} 0%, transparent 70%)`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* Victory Text */}
        <div className="animate-bounce-in">
          <h2 className="mb-2 bg-linear-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-5xl font-extrabold text-transparent md:text-6xl">
             You Won! 
          </h2>
          <div className="h-1 w-32 rounded-full bg-linear-to-r from-yellow-300 to-yellow-500 mx-auto" />
        </div>

        {/* Category Image with Glow */}
        {result.categoryImage && (
          <div className="animate-scale-in relative">
            {/* Glowing ring effect */}
            <div
              className="absolute inset-0 animate-pulse rounded-full opacity-50 blur-2xl"
              style={{
                backgroundColor: result.categoryColor || "#8b5cf6",
                transform: "scale(1.5)",
              }}
            />

            {/* Image container */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full animate-spin-slow"
                style={{
                  background: `conic-linear(from 0deg, ${result.categoryColor || "#8b5cf6"}, transparent, ${result.categoryColor || "#8b5cf6"})`,
                  filter: "blur(10px)",
                }}
              />
              <img
                src={result.categoryImage}
                alt={result.categoryName}
                className="relative h-48 w-48 rounded-full border-4 border-white object-cover shadow-2xl md:h-56 md:w-56"
              />
            </div>
          </div>
        )}

        {/* Category Name */}
        <div className="animate-slide-up space-y-2">
          <p className="text-lg font-medium text-white/80">Your Prize</p>
          <h3 className="text-3xl font-bold text-white md:text-4xl">
            {result.categoryName}
          </h3>
        </div>

        {/* Divider */}
        <div className="my-4 h-px w-64 bg-linear-to-r from-transparent via-white/30 to-transparent" />

        {/* Stats */}
        <div className="flex gap-8 text-center">
          <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
            <p className="text-sm font-medium text-white/60">Total Spins</p>
            <p className="text-2xl font-bold text-white">{result.spins}</p>
          </div>
        </div>

        {/* Collect/Play Again Button */}
        {onPlayAgain && (
          <button
            onClick={onPlayAgain}
            className="group relative mt-4 overflow-hidden rounded-2xl border-0 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 px-10 py-3 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/50"
          >
            <span className="relative z-10 flex items-center gap-2">
              Spin Again
            </span>

            {/* Button shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        )}

        {/* Decorative Elements
        <div className="absolute -left-10 top-20 animate-float text-4xl opacity-20">
          ✨
        </div>
        <div className="absolute -right-10 top-40 animate-float text-4xl opacity-20" style={{ animationDelay: "1s" }}>
          🎊
        </div>
        <div className="absolute bottom-20 left-10 animate-float text-4xl opacity-20" style={{ animationDelay: "0.5s" }}>
          🎉
        </div> */}
      </div>
    </div>
  )
}
