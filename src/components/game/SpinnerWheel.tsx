"use client"

import type React from "react"
import type { Category } from "../../types"
import { useSpinnerAnimation } from "../../hooks/useSpinnerAnimation"
import { soundManager } from "../../utils/soundManager"

interface SpinnerWheelProps {
  categories: Category[]
  onSegmentSelect?: (category: Category) => void
}

export const SpinnerWheel: React.FC<SpinnerWheelProps> = ({
  categories,
  onSegmentSelect,
}) => {
  const { rotation, isSpinning, selectedIndex, spin } = useSpinnerAnimation({
    duration: 3000,
    onComplete: (index) => {
      if (categories[index]) {
        soundManager.playWin()
        onSegmentSelect?.(categories[index])
      }
    },
  })

  if (!categories.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg text-white/60">No categories available</p>
      </div>
    )
  }

  const segmentAngle = 360 / categories.length

  const handleSpin = () => {
    soundManager.playSpinStart()
    spin(categories.length)
  }

  return (
    <div className="flex flex-col items-center gap-12 py-8">
      {/* Spinner Container with Glow Effect */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-20 blur-3xl" />

        {/* Larger Spinner Wheel */}
        <div className="relative h-[450px] w-[450px] md:h-[500px] md:w-[500px]">
          {/* Pointer/Arrow at Top */}
          <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
            <div className="relative">
              <div className="h-12 w-7 rounded-b-4xl bg-linear-to-b from-blue-300 to-blue-500 shadow-2xl" />
              <div className="absolute inset-0 animate-pulse rounded-b-4xl bg-blue-400 opacity-50" />
            </div>
          </div>

          {/* SVG Wheel */}
          <svg
            viewBox="0 -4 200 212"
            className="h-full w-full drop-shadow-2xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "none",
              filter: "drop-shadow(0 10px 50px rgba(0, 0, 0, 0.5))",
            }}
          >
            {/* Outer Ring Border */}
            <circle
              cx="100"
              cy="100"
              r="102"
              fill="none"
              stroke="url(#borderGradient)"
              strokeWidth="4"
            />

            <defs>
              <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>

            {/* Segments */}
            {categories.map((category, index) => {
              const startAngle = (index * segmentAngle * Math.PI) / 180
              const endAngle = ((index + 1) * segmentAngle * Math.PI) / 180
              const midAngle = (startAngle + endAngle) / 2

              const x1 = 100 + 100 * Math.cos(startAngle - Math.PI / 2)
              const y1 = 100 + 100 * Math.sin(startAngle - Math.PI / 2)
              const x2 = 100 + 100 * Math.cos(endAngle - Math.PI / 2)
              const y2 = 100 + 100 * Math.sin(endAngle - Math.PI / 2)

              const pathData = `
                M 100 100
                L ${x1} ${y1}
                A 100 100 0 0 1 ${x2} ${y2}
                Z
              `

              // Image position
              const imgX = 100 + 55 * Math.cos(midAngle - Math.PI / 2)
              const imgY = 100 + 55 * Math.sin(midAngle - Math.PI / 2)

              // Text position
              const textX = 100 + 78 * Math.cos(midAngle - Math.PI / 2)
              const textY = 100 + 78 * Math.sin(midAngle - Math.PI / 2)

              const textRotation = (midAngle * 180) / Math.PI

              return (
                <g key={index}>
                  {/* Segment Path */}
                  <path
                    d={pathData}
                    fill={category.color}
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity={selectedIndex === index ? 1 : 0.95}
                    style={{
                      transition: "opacity 0.3s ease",
                    }}
                  />

                  {/* Category Image/Avatar */}
                  {category.imageUrl && (
                    <>
                      <defs>
                        <clipPath id={`clip-${index}`}>
                          <circle cx={imgX} cy={imgY} r="14" />
                        </clipPath>
                      </defs>

                      <circle cx={imgX} cy={imgY} r="16" fill="white" />
                      <image
                        href={category.imageUrl}
                        x={imgX - 14}
                        y={imgY - 14}
                        width={28}
                        height={28}
                        clipPath={`url(#clip-${index})`}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </>
                  )}

                  {/* Category Name */}
                  <text
                    x={textX}
                    y={textY}
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="white"
                    className="pointer-events-none select-none"
                    style={{
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {category.name.substring(0, 12)}
                  </text>
                </g>
              )
            })}

            {/* Center Circle */}
            <circle cx="100" cy="100" r="24" fill="url(#centerGradient)" />
            <circle cx="100" cy="100" r="18" fill="#1e40af" />

            <defs>
              <radialGradient id="centerGradient">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e5e7eb" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 px-12 py-3 text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-pink-500/50 disabled:scale-100 disabled:opacity-50 disabled:hover:shadow-none"
      >
        <span className="relative z-10">
          {isSpinning ? "Spinning..." : "SPIN"}
        </span>

        {/* Button shine effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </button>
    </div>
  )
}