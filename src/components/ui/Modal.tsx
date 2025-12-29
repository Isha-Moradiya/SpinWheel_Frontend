"use client"

import { X } from "lucide-react"
import type React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-blue-50 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">
            {title}
          </h2>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 transition hover:bg-gray-300 hover:text-gray-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 border-0"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>

  )
}
