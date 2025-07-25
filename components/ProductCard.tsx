"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import { addToWishlist, removeFromWishlist } from "@/lib/redux/slices/wishlistSlice"
import type { RootState } from "@/lib/redux/store"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingBag, Eye } from "lucide-react"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch()
  const wishlistItems = useSelector((state: RootState) => state.wishlist?.items)
  const isInWishlist = wishlistItems.includes(product?._id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product?.inventory === 0) {
      toast.error("Product is out of stock")
      return
    }

    dispatch(addToCart({ product, quantity: 1 }))
    toast.success("Added to cart!")
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWishlist) {
      dispatch(removeFromWishlist(product?._id))
      toast.success("Removed from wishlist")
    } else {
      dispatch(addToWishlist(product?._id))
      toast.success("Added to wishlist")
    }
  }

  const discountPercentage =
    product?.comparePrice && product?.comparePrice > product?.price
      ? Math.round(((product?.comparePrice - product?.price) / product?.comparePrice) * 100)
      : 0

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="group">
      <Card className="overflow-hidden h-full flex flex-col">
        <Link href={`/products/${product?.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
            <Image
              src={product?.images[0] || "/placeholder.svg?height=300&width=300"}
              alt={product?.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
              {product?.inventory === 0 && (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              )}
              {product?.inventory > 0 && product?.inventory <= 5 && (
                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                  Low Stock
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900"
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
            </Button>

            {/* Quick View Button */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
            </div>
          </div>
        </Link>

        <CardContent className="p-4 flex-1">
          <Link href={`/products/${product?.slug}`} className="block">
            <Badge variant="outline" className="mb-2 text-xs">
              {product?.category}
            </Badge>

            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product?.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product?.rating.average) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product?.rating.count})</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg font-bold text-gray-900 dark:text-white">${product?.price}</span>
              {product?.comparePrice && product?.comparePrice > product?.price && (
                <span className="text-sm text-muted-foreground line-through">${product?.comparePrice}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">{product?.description}</p>
          </Link>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product?.inventory === 0}
            className="w-full"
            variant={product?.inventory === 0 ? "secondary" : "default"}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            {product?.inventory === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
