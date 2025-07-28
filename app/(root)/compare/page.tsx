"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import type { Product } from "@/lib/types"
import ProductComparison from "@/components/compare/ProductComparison"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Scale } from "lucide-react"
import Link from "next/link"

export default function ComparePage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const ids = searchParams.get("ids")
    if (ids) {
      fetchProducts(ids)
    } else {
      setError("No products selected for comparison")
      setLoading(false)
    }
  }, [searchParams])

  const fetchProducts = async (ids: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/compare?ids=${ids}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
      } else {
        setError(data.error || "Failed to fetch products")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to fetch products for comparison")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded mb-8 w-64"></div>
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || products?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="max-w-md mx-auto">
              <CardContent className="p-12 text-center">
                <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {error || "No products to compare"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Select products from the catalog to compare their features.
                </p>
                <Button asChild>
                  <Link href="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Browse Products
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Scale className="h-8 w-8 mr-3" />
                Product Comparison
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Compare {products?.length} products side by side</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <ProductComparison products={products} />
      </div>
    </div>
  )
}
