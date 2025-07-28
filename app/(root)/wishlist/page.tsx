"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import type { RootState } from "@/lib/redux/store"
import { removeFromWishlist, clearWishlist } from "@/lib/redux/slices/wishlistSlice"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  Share2,
  Star,
  Package
} from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function WishlistPage() {
  const dispatch = useDispatch()
  const wishlistItems = useSelector((state: RootState) => state.wishlist?.items || [])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlistProducts()
  }, [wishlistItems])

  const fetchWishlistProducts = async () => {
    if (wishlistItems.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const productPromises = wishlistItems.map(async (id) => {
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          return response.json()
        }
        return null
      })

      const results = await Promise.all(productPromises)
      const validProducts = results.filter(Boolean)
      setProducts(validProducts)
    } catch (error) {
      console.error("Error fetching wishlist products:", error)
      toast.error("Failed to load wishlist items")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeFromWishlist(productId))
    toast.success("Removed from wishlist")
  }

  const handleAddToCart = (product: Product) => {
    if (product.inventory === 0) {
      toast.error("Product is out of stock")
      return
    }

    dispatch(addToCart({ product, quantity: 1 }))
    toast.success("Added to cart!")
  }

  const handleClearWishlist = () => {
    dispatch(clearWishlist())
    toast.success("Wishlist cleared")
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Wishlist',
        text: 'Check out my wishlist!',
        url: window.location.href,
      })
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      toast.success("Wishlist URL copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-300 dark:bg-gray-700 h-80 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/products">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-3">
                <Heart className="h-6 w-6 text-red-500" />
                <h1 className="text-2xl font-bold">My Wishlist</h1>
                <Badge variant="secondary">{products.length} items</Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              {products.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear Wishlist</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove all items from your wishlist? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearWishlist}>
                        Clear All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="text-6xl mb-6">💝</div>
            <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Start adding items to your wishlist by clicking the heart icon on products you love.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600">
                <Package className="h-5 w-5 mr-2" />
                Discover Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          // Wishlist Items
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <Link href={`/products/${product.slug}`}>
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>
                        
                        {/* Remove from Wishlist Button */}
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute top-3 right-3 h-8 w-8 bg-white/90 hover:bg-white"
                          onClick={() => handleRemoveFromWishlist(product._id)}
                        >
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>

                        {/* Stock Status */}
                        {product.inventory === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary" className="text-white bg-black/70">
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <Link href={`/products/${product.slug}`}>
                          <Badge variant="outline" className="mb-2 text-xs">
                            {product.category}
                          </Badge>
                          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {product.title}
                          </h3>
                          
                          {/* Rating */}
                          {product.rating && (
                            <div className="flex items-center space-x-1 mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(product.rating.average)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                ({product.rating.count})
                              </span>
                            </div>
                          )}

                          {/* Price */}
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="text-lg font-bold text-primary">
                              ${product.price}
                            </span>
                            {product.comparePrice && product.comparePrice > product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.comparePrice}
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.inventory === 0}
                            className="flex-1"
                            size="sm"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {product.inventory === 0 ? "Out of Stock" : "Add to Cart"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
