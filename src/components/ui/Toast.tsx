"use client"

import React, { useState, useCallback } from "react"

interface ToastMessage {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

let toastId = 0
const toastCallbacks: ((message: ToastMessage) => void)[] = []

export const useToast = () => {
  return useCallback((message: string, type: "success" | "error" | "info" = "info", duration = 3000) => {
    const id = `toast-${toastId++}`
    const toastMessage: ToastMessage = { id, message, type, duration }
    toastCallbacks.forEach((cb) => cb(toastMessage))
  }, [])
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  React.useEffect(() => {
    const handleToast = (message: ToastMessage) => {
      setToasts((prev) => [...prev, message])

      if (message.duration) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== message.id))
        }, message.duration)
      }
    }

    toastCallbacks.push(handleToast)

    return () => {
      toastCallbacks.splice(toastCallbacks.indexOf(handleToast), 1)
    }
  }, [])

  const bgColor = {
    success: "bg-green-500/80",
    error: "bg-red-500/80",
    info: "bg-blue-500/80",
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${bgColor[toast.type]} rounded-lg px-4 py-3 text-white backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
