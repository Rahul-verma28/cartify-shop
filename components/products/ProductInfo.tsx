"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RefreshCw, 
  Minus, 
  Plus, 
  Check, 
  Zap, 
  CheckCircle 
} from "lucide-react"
import { RatingStars } from "@/components/products/RatingStars"

interface ProductInfoProps {
  product: any
  selectedSize: string
  selectedColor: string
  quantity: number
  addedToCart: boolean
  isWishlisted: boolean
  onSizeChange: (size: string) => void
  onColorChange: (color: string) => void
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
  onWishlistToggle: () => void
  onShare: () => void
}

export function ProductInfo({
  product,
  selectedSize,
  selectedColor,
  quantity,
  addedToCart,
  isWishlisted,
  onSizeChange,
  onColorChange,
  onQuantityChange,
  onAddToCart,
  onWishlistToggle,
  onShare
}: ProductInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-3"
    >
      <div>
        <div>
          <div className="flex items-center space-x-2 mb-2">
            {product.featured && (
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                <Zap className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            <Badge variant="outline" className="capitalize">
              {product.category?.replace("-", " ")}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {product.title}
          </h1>

          <div className="flex items-center space-x-4 mb-4">
            <RatingStars
              rating={product.rating.average}
              size="lg"
              showValue
            />
            <span className="text-muted-foreground">
              ({product.rating.count} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-3">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${product.price?.toFixed(2)}
          </span>
          {product.comparePrice && (
            <>
              <span className="text-xl text-gray-500 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
              <Badge variant="destructive">
                {Math.round(
                  ((product.comparePrice - product.price) /
                    product.comparePrice) *
                    100
                )}
                % OFF
              </Badge>
            </>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Product Options */}
      <div className="space-y-3">
        {product.size && product.size.length > 0 && (
          <div>
            <label className="block text-sm mb-3 text-gray-900 dark:text-white">
              Size:{" "}
              {selectedSize && (
                <span className="font-normal text-blue-600">
                  {selectedSize}
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.size.map((size: string) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSizeChange(size)}
                  className="min-w-[3rem] h-10"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {product.color && product.color.length > 0 && (
          <div>
            <label className="block text-sm mb-3 text-gray-900 dark:text-white">
              Color:{" "}
              {selectedColor && (
                <span className="font-normal text-blue-600">
                  {selectedColor}
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.color.map((color: string) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  size="sm"
                  onClick={() => onColorChange(color)}
                  className="capitalize"
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <label className="block text-sm text-gray-900 dark:text-white">
            Quantity:{" "}
          </label>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-16 text-center font-semibold text-lg">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onQuantityChange(
                  Math.min(product.inventory || 99, quantity + 1)
                )
              }
              disabled={quantity >= (product.inventory || 99)}
              className="w-10 h-10 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm">
            <span className="font-medium text-green-600">In Stock</span> -{" "}
            {product.inventory || 99} units available
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            size="lg"
            className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            onClick={onAddToCart}
            disabled={addedToCart}
          >
            {addedToCart ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </>
            )}
          </Button>
        </motion.div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onWishlistToggle}
          >
            <Heart
              className={`w-5 h-5 mr-2 ${
                isWishlisted ? "fill-current text-red-500" : ""
              }`}
            />
            {isWishlisted ? "Saved" : "Save"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onShare}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Product Features */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-sm">2 Year Warranty</p>
                <p className="text-xs text-gray-500">Full coverage</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-sm">30-Day Returns</p>
                <p className="text-xs text-gray-500">No questions asked</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
