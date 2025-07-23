"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import Image from "next/image"
import { motion } from "framer-motion"
import { StarIcon, HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import type { Product } from "@/types"
import { addToCart } from "@/redux/slices/cartSlice"
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { toast } from "sonner"
import ProductReviews from "./ProductReviews"

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const dispatch = useDispatch()
  const wishlistItems = useSelector((state: RootState) => state.wishlist?.items)
  const isInWishlist = wishlistItems.includes(product?._id)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }))
    toast.success(`Added ${quantity} item(s) to cart!`)
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product?._id))
      toast.success("Removed from wishlist")
    } else {
      dispatch(addToWishlist(product?._id))
      toast.success("Added to wishlist")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900"
          >
            <Image
              src={product?.images[selectedImage] || "/placeholder.svg?height=600&width=600"}
              alt={product?.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Thumbnail Images */}
          {product?.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product?.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary-600" : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product?.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product?.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product?.rating.average) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({product?.rating.count} reviews)</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">SKU: {product?._id.slice(-8)}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">${product?.price}</span>
            {product?.comparePrice && product?.comparePrice > product?.price && (
              <span className="text-xl text-gray-500 line-through">${product?.comparePrice}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product?.description}</p>
          </div>

          {/* Tags */}
          {product?.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product?.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Quantity:</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{product?.inventory} in stock</span>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product?.inventory === 0}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleWishlistToggle}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {isInWishlist ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-900 dark:text-white">Category</dt>
                <dd className="text-sm text-gray-600 dark:text-gray-300">{product?.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-900 dark:text-white">Availability</dt>
                <dd className="text-sm text-gray-600 dark:text-gray-300">
                  {product?.inventory > 0 ? "In Stock" : "Out of Stock"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <ProductReviews productId={product?._id} />
      </div>
    </div>
  )
}
