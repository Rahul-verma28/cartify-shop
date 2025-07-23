"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { Product, CartItem } from "@/types"
import ProductCard from "@/components/ProductCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface RecommendedProductsProps {
  cartItems: CartItem[]
}

export default function RecommendedProducts({ cartItems }: RecommendedProductsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [cartItems])

  const fetchRecommendations = async () => {
    try {
      const categories = cartItems.map((item) => item.product?.category)
      const response = await fetch(`/api/products/recommendations?categories=${categories.join(",")}`)
      const data = await response.json()
      setRecommendations(data.products || [])
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.slice(0, 4).map((product, index) => (
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
        </CardContent>
      </Card>
    </motion.div>
  )
}
