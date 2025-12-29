// Core type definitions for the entire application

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  color: string
  imageUrl: string
  icon: string
  createdAt: string
  updatedAt: string
}

export interface GameResult {
  categoryId: string
  categoryName: string
  categoryImage?: string
  categoryColor?: string
  timestamp: string
  spins: number
}

// AuthContextType is now defined in AuthContext.tsx
