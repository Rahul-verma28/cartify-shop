"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import ProductForm from "@/components/admin/ProductForm"
import type { Product } from "@/types"

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (productData: Partial<Product>) => {
    setLoading(true)

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        toast.success("Product created successfully!")
        router.push("/admin/products")
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to create product")
      }
    } catch (error) {
      toast.error("Error creating product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
        <p className="text-gray-600 dark:text-gray-400">Create a new product for your store</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </motion.div>
    </div>
  )
}
