"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Modal } from "../ui/Modal"
import { CategoryForm } from "./CategoryForm"
import type { Category } from "../../types"
import {
  createCategory,
  getCategories,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
  type CreateCategoryData,
  type UpdateCategoryData,
} from "../../api/categoryApi"
import { useToast } from "../ui/Toast"
import { formatDate } from "../../utils/dateFormat"

export const CategoryList: React.FC = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()
  const [isDeleteConfirming, setIsDeleteConfirming] = useState<string | null>(null)

  const mapCategoryToFrontend = (backendCategory: any): Category => ({
    id: backendCategory.id,
    name: backendCategory.title,
    description: backendCategory.description || "",
    color: backendCategory.color || "#3b82f6",
    imageUrl: backendCategory.image,
    icon: "star",
    createdAt: backendCategory.createdAt || new Date().toISOString(),
    updatedAt: backendCategory.updatedAt || new Date().toISOString(),
  })

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await getCategories()
      const mappedCategories = response.categories.map(mapCategoryToFrontend)
      setCategories(mappedCategories)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch categories"
      toast(errorMessage, "error")
      console.error("Error fetching categories:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddNew = () => {
    setSelectedCategory(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  const handleAddCategory = async (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt"> & { imageUrl: string | File }) => {
    try {
      if (!((categoryData.imageUrl as any) instanceof File)) {
        toast("Image file is required for new category", "error")
        return
      }

      const createData: CreateCategoryData = {
        title: categoryData.name,
        description: categoryData.description,
        color: categoryData.color,
        image: categoryData.imageUrl as File,
      }

      const response = await createCategory(createData)
      const newCategory = mapCategoryToFrontend(response.data.category)
      setCategories((prev) => [...prev, newCategory])
      toast("Category created successfully", "success")
      setIsFormOpen(false)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create category"
      toast(errorMessage, "error")
      throw err
    }
  }

  const handleUpdateCategory = async (id: string, categoryData: Partial<Category> & { imageUrl?: string | File }) => {
    try {
      const updateData: UpdateCategoryData = {}

      if (categoryData.name) updateData.title = categoryData.name
      if (categoryData.description !== undefined) updateData.description = categoryData.description
      if (categoryData.color) updateData.color = categoryData.color

      // Handle image - if it's a File, use it directly
      if ((categoryData.imageUrl as any) instanceof File) {
        updateData.image = categoryData.imageUrl as File
      }

      const response = await updateCategoryApi(id, updateData)
      const updatedCategory = mapCategoryToFrontend(response.data.category)
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCategory : cat))
      )
      toast("Category updated successfully", "success")
      setIsFormOpen(false)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update category"
      toast(errorMessage, "error")
      throw err
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCategoryApi(id)
      setCategories((prev) => prev.filter((cat) => cat.id !== id))
      toast("Category deleted successfully", "success")
      setIsDeleteConfirming(null)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete category"
      toast(errorMessage, "error")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading categories...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Categories ({categories.length}/8)</h2>

        <div className="flex items-center gap-2">
          {categories.length > 0 && (
            <button
              onClick={() => navigate("/game")}
              className="rounded-lg bg-emerald-500/90 px-4 py-2 text-white hover:bg-emerald-600 border-0 font-semibold"
            >
              ▶ Play Game
            </button>
          )}

          {categories.length < 8 && (
            <button
              onClick={handleAddNew}
              className="rounded-lg bg-linear-to-r from-blue-500 to-blue-600 px-4 py-2 text-white hover:from-blue-600 hover:to-blue-700 border-0 font-semibold"
            >
              + Add Category
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-2 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            {category.imageUrl && (
              <img
                src={category.imageUrl || "/placeholder.svg"}
                alt={category.name}
                className="mb-2 h-40 w-full rounded-lg object-cover"
              />
            )}
            <h3 className="font-bold text-white">{category.name}</h3>
            <p className="text-sm text-white/60 mb-2">{category.description}</p>
            <span className="flex gap-1.5 text-sm text-white/70 mb-1 font-semibold">CreatedAt:
              <p className="font-normal text-white/60">{formatDate(category.createdAt)}</p>
            </span>

            <span className="flex items-center gap-1.5 text-sm text-white/70 mb-2 font-semibold">Category Color:
              <div className="h-4 w-10 rounded" style={{ backgroundColor: category.color }} />
            </span>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="flex-1 font-semibold text-sm text-blue-400 hover:text-blue-500 border-0 py-1.5 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => setIsDeleteConfirming(category.id)}
                className="flex-1 font-semibold text-sm text-red-400 hover:text-red-500 border-0 py-1.5 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedCategory ? "Edit Category" : "Add Category"}
      >
        <CategoryForm
          category={selectedCategory}
          onSubmit={selectedCategory ? (data) => handleUpdateCategory(selectedCategory.id, data) : handleAddCategory}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {isDeleteConfirming && (
        <Modal isOpen onClose={() => setIsDeleteConfirming(null)} title="Confirm Delete">
          <div className="flex flex-col gap-4">
            <p className="text-gray-600 text-sm text-center">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(isDeleteConfirming)}
                className="flex-1 rounded-lg bg-red-500/80 py-2.5 font-semibold text-white hover:bg-red-600 border-0"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteConfirming(null)}
                className="flex-1 rounded-lg font-semibold py-2.5 border-0 text-gray-700 bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
