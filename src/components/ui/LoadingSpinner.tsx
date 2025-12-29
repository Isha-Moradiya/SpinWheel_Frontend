"use client"

import type React from "react"

export const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }[size]

  return <div className={`${sizeClass} animate-spin rounded-full border-4 border-white/20 border-t-white`} />
}
