"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import type { Product } from "@/types"
import ProductCard from "@/components/ProductCard"
import SearchFilters from "@/components/search/SearchFilters"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    sortBy: "relevance",
  })

  useEffect(() => {
    searchProducts()
  }, [searchQuery, filters])

  const searchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        category: filters.category,
        minPrice: filters.minPrice.toString(),
        maxPrice: filters.maxPrice.toString(),
        rating: filters.rating.toString(),
        sortBy: filters.sortBy,
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error searching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchProducts()
  }

  const clearSearch = () => {
    setSearchQuery("")
    setFilters({
      category: "",
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      sortBy: "relevance",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search products?..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
                {searchQuery && (
                  <Button variant="outline" onClick={clearSearch}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <SearchFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Mobile Filters */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mb-6 bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SearchFilters filters={filters} onFiltersChange={setFilters} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {loading ? "Searching..." : `${products?.length} products found`}
                </p>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-800"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products?.map((product, index) => (
                  <motion.div
                    key={product?._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search terms or filters</p>
                  <Button onClick={clearSearch}>Clear Search</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
