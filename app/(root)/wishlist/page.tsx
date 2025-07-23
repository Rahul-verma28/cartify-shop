"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import type { RootState } from "@/redux/store"
import type { Product } from "@/types"
import { addToCart } from "@/redux/slices/cartSlice"
import { removeFromWishlist, clearWishlist } from "@/redux/slices/wishlistSlice"
import WishlistItem from "@/components/wishlist/WishlistItem"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function WishlistPage() {
  const dispatch = useDispatch()
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlistItems.length > 0) {
      fetchWishlistProducts()
    } else {
      setLoading(false)
    }
  }, [wishlistItems])

  const fetchWishlistProducts = async () => {
    try {
      const response = await fetch(`/api/products/wishlist?ids=${wishlistItems.join(",")}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching wishlist products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeFromWishlist(productId))
    toast.success("Removed from wishlist")
  }

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success("Added to cart!")
  }

  const handleAddAllToCart = () => {
    products?.forEach((product) => {
      if (product?.inventory > 0) {
        dispatch(addToCart({ product, quantity: 1 }))
      }
    })
    toast.success("All available items added to cart!")
  }

  const handleClearWishlist = () => {
    dispatch(clearWishlist())
    toast.success("Wishlist cleared")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        </div>
      </div>
    )
  }

  if (products?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-12">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Save items you love by clicking the heart icon on any product?.
                </p>
                <Button asChild className="w-full">
                  <Link href="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Start Shopping
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Heart className="h-8 w-8 mr-3 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {products?.length} {products?.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleAddAllToCart} disabled={products?.length === 0}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add All to Cart
              </Button>
              <Button variant="destructive" onClick={handleClearWishlist} disabled={products?.length === 0}>
                Clear Wishlist
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product, index) => (
            <motion.div
              key={product?._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WishlistItem product={product} onRemove={handleRemoveFromWishlist} onAddToCart={handleAddToCart} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
