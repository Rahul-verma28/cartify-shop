"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag, Star } from "lucide-react"
import type { Product } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface WishlistItemProps {
  product: Product
  onRemove: (productId: string) => void
  onAddToCart: (product: Product) => void
}

export default function WishlistItem({ product, onRemove, onAddToCart }: WishlistItemProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product?.images[0] || "/placeholder.svg?height=300&width=300"}
          alt={product?.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Remove Button */}
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={() => onRemove(product?._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* Stock Status */}
        {product?.inventory === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <Link href={`/products/${product?.slug}`} className="block mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary line-clamp-2">
            {product?.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product?.rating.average) ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">({product?.rating.count})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl font-bold text-gray-900 dark:text-white">${product?.price}</span>
          {product?.comparePrice && product?.comparePrice > product?.price && (
            <span className="text-sm text-muted-foreground line-through">${product?.comparePrice}</span>
          )}
        </div>

        {/* Category */}
        <Badge variant="secondary" className="mb-4">
          {product?.category}
        </Badge>

        {/* Add to Cart Button */}
        <Button
          onClick={() => onAddToCart(product)}
          disabled={product?.inventory === 0}
          className="w-full"
          variant={product?.inventory === 0 ? "secondary" : "default"}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          {product?.inventory === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>

        {/* Stock Warning */}
        {product?.inventory > 0 && product?.inventory <= 5 && (
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 text-center">
            Only {product?.inventory} left in stock
          </p>
        )}
      </CardContent>
    </Card>
  )
}
