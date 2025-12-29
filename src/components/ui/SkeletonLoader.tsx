"use client"

import type React from "react"

interface SkeletonLoaderProps {
  count?: number
  height?: string
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 3, height = "h-24" }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${height} w-full animate-pulse rounded-lg bg-white/10`} />
      ))}
    </div>
  )
}
