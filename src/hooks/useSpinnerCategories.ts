"use client"

// Custom hook for fetching spinner categories (public endpoint)
// Used by GamePage

import { useState, useEffect } from "react"
import type { Category } from "../types"
import { getSpinnerCategories } from "../api/categoryApi"

export const useSpinnerCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSpinnerCategories = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await getSpinnerCategories()
        // Map backend format (title, image) to frontend format (name, imageUrl)
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch spinner categories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpinnerCategories()
  }, [])

  return { categories, isLoading, error }
}

