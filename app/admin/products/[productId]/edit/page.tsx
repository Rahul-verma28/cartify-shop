"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import ProductForm from "@/components/admin/ProductForm"
import type { Product } from "@/lib/types"

interface EditProductPageProps {
  params: Promise<{
    productId: string
  }>
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [resolvedParams.productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${resolvedParams.productId}`)
      const data = await response.json()
      if (response.ok) {
        setProduct(data.product)
      } else {
        toast.error(data.error || "Failed to fetch product")
        router.push("/admin/products") // Redirect if product not found
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Error fetching product")
      router.push("/admin/products")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (productData: Partial<Product>) => {
    setSubmitting(true)

    try {
      const response = await fetch(`/api/admin/products/${resolvedParams.productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        toast.success("Product updated successfully!")
        router.push("/admin/products")
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Error updating product")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null // Should redirect by now, but good for safety
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
        <p className="text-gray-600 dark:text-gray-400">Modify details for {product?.title}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <ProductForm product={product} onSubmit={handleSubmit} loading={submitting} />
      </motion.div>
    </div>
  )
}
