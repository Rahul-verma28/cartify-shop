"use client"

import type React from "react"

import { useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import type { Product } from "@/types"

interface ProductFormProps {
  product?: Partial<Product>
  onSubmit: (data: Partial<Product>) => void
  loading: boolean
}

export default function ProductForm({ product, onSubmit, loading }: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: product?.title || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    comparePrice: product?.comparePrice || 0,
    category: product?.category || "",
    tags: product?.tags || [],
    inventory: product?.inventory || 0,
    featured: product?.featured || false,
    images: product?.images || [],
  })

  const [newTag, setNewTag] = useState("")
  const [newImage, setNewImage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-generate slug from title
    if (field === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }))
      setNewImage("")
    }
  }

  const removeImage = (imageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image !== imageToRemove),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="input-field"
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              className="input-field"
              placeholder="product-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="input-field"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="input-field"
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home-garden">Home & Garden</option>
              <option value="sports">Sports</option>
              <option value="books">Books</option>
              <option value="beauty">Beauty</option>
            </select>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Inventory</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compare Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.comparePrice}
              onChange={(e) => handleInputChange("comparePrice", Number.parseFloat(e.target.value) || 0)}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inventory *</label>
            <input
              type="number"
              required
              min="0"
              value={formData.inventory}
              onChange={(e) => handleInputChange("inventory", Number.parseInt(e.target.value))}
              className="input-field"
              placeholder="0"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleInputChange("featured", e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Featured Product
            </label>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-primary-600 hover:text-primary-800"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            className="input-field flex-1"
            placeholder="Add a tag"
          />
          <button type="button" onClick={addTag} className="btn-secondary">
            Add Tag
          </button>
        </div>
      </div>

      {/* Images */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images</h3>
        <div className="space-y-2 mb-4">
          {formData.images.map((image, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{image}</span>
              <button type="button" onClick={() => removeImage(image)} className="text-red-600 hover:text-red-800">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="url"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
            className="input-field flex-1"
            placeholder="Add image URL"
          />
          <button type="button" onClick={addImage} className="btn-secondary">
            Add Image
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={() => window.history.back()} className="btn-secondary">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  )
}
