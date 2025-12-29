"use client"
import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error("[v0] Error caught:", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-4">
          <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm text-center">
            <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
            <p className="mt-2 text-white/70">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-white hover:from-blue-600 hover:to-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
