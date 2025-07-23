"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface TopProduct {
  _id: string
  title: string
  image: string
  sales: number
  revenue: number
}

export default function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopProducts()
  }, [])

  const fetchTopProducts = async () => {
    try {
      const response = await fetch("/api/admin/top-products")
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Error fetching top products:", error)
      // Mock data for demo
      setProducts([
        {
          _id: "1",
          title: "Wireless Headphones",
          image: "/placeholder.svg?height=50&width=50",
          sales: 234,
          revenue: 23400,
        },
        {
          _id: "2",
          title: "Smart Watch",
          image: "/placeholder.svg?height=50&width=50",
          sales: 189,
          revenue: 18900,
        },
        {
          _id: "3",
          title: "Laptop Stand",
          image: "/placeholder.svg?height=50&width=50",
          sales: 156,
          revenue: 15600,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
      <div className="space-y-4">
        {products?.map((product, index) => (
          <motion.div
            key={product?._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center space-x-4"
          >
            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image src={product?.image || "/placeholder.svg"} alt={product?.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{product?.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product?.sales} sales • ${product?.revenue.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
