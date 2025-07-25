"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateFilters, resetFilters } from "@/lib/redux/slices/productsSlice"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"

const categories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty", "Toys", "Automotive"]

const priceRanges = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: 1000 },
]

export default function ProductFilters() {
  const dispatch = useDispatch()  
  const { filters } = useSelector((state: RootState) => state.products)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleCategoryChange = (category: string) => {
    dispatch(
      updateFilters({
        category: filters.category === category ? "" : category,
      }),
    )
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    dispatch(updateFilters({ priceRange: [min, max] }))
  }

  const handleRatingChange = (rating: number) => {
    dispatch(
      updateFilters({
        rating: filters.rating === rating ? 0 : rating,
      }),
    )
  }

  const handleReset = () => {
    dispatch(resetFilters())
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        <button onClick={handleReset} className="text-sm text-primary-600 hover:text-primary-700">
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("category")}
          className="flex justify-between items-center w-full text-left font-medium text-gray-900 dark:text-white mb-3"
        >
          Category
          {expandedSections.category ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </button>
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.category === category.toLowerCase()}
                  onChange={() => handleCategoryChange(category.toLowerCase())}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("price")}
          className="flex justify-between items-center w-full text-left font-medium text-gray-900 dark:text-white mb-3"
        >
          Price Range
          {expandedSections.price ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </button>
        {expandedSections.price && (
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.label} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange[0] === range.min && filters.priceRange[1] === range.max}
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("rating")}
          className="flex justify-between items-center w-full text-left font-medium text-gray-900 dark:text-white mb-3"
        >
          Rating
          {expandedSections.rating ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.rating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">& up</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
