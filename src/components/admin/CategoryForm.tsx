"use client"

import type React from "react"
import { useRef, useState } from "react"
import type { Category } from "../../types"
import { useToast } from "../ui/Toast"
import { Upload, X } from "lucide-react"

interface CategoryFormProps {
  category?: Category
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(category?.name || "")
  const [description, setDescription] = useState(category?.description || "")
  const [color, setColor] = useState(category?.color || "#3b82f6")
  const [imageUrl, setImageUrl] = useState(category?.imageUrl || "")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      toast("Image must be under 50MB")
      return
    }

    setImageFile(file)
    setImageUrl(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    setImageUrl("")

    // reset input to allow re-upload of same file
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !description.trim()) {
      toast("Please fill in all fields", "error")
      return
    }

    // For new categories, image is required
    if (!category && !imageFile) {
      toast("Please upload an image", "error")
      return
    }

    setIsLoading(true)

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        color,
        imageUrl: imageFile || imageUrl, 
        icon: "star",
      })
      toast(category ? "Category updated" : "Category created", "success")
      onCancel()
    } catch {
      toast("Failed to save category", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">
          Image
        </label>

        {/* Upload Box */}
        <div
          onClick={() => !imageUrl && fileInputRef.current?.click()}
          className="relative flex items-center justify-center border-2 border-dashed rounded-2xl h-56 bg-[#f5f5f7] cursor-pointer hover:border-[#740EBE] transition"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* IMAGE PREVIEW */}
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="Uploaded"
                className="h-full w-full object-cover rounded-2xl"
              />

              {/* REMOVE BUTTON */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage()
                }}
                className="absolute top-2 right-2 flex items-center justify-center border-0 w-6 h-6 rounded-full bg-red-500/90 text-white shadow-sm transition-all duration-200 hover:bg-red-600 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <X size={14} strokeWidth={2.5} />
              </button>

            </>
          ) : (
            // EMPTY STATE
            <div className="text-center pointer-events-none">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Upload size={32} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">Click to upload</p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 50MB
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white/10 px-4 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter category name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white/10 px-4 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter category description"
          rows={3}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Category Background Color
        </label>

        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300 bg-transparent p-1"
          />

          {/* Color Preview */}
          <div
            className="h-10 w-25 rounded-lg border border-gray-300"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>


      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg font-semibold bg-linear-to-r from-blue-500 to-blue-600 py-2.5 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 border-0"
        >
          {isLoading ? "Saving..." : "Save Category"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg font-semibold py-2.5 border-0 text-gray-700 bg-gray-200 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

