"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Heart, Minus, Plus } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice"
import type { RootState } from "@/redux/store"
import type { CartItem as CartItemType } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const dispatch = useDispatch()
  const wishlistItems = useSelector((state: RootState) => state.wishlist?.items)
  const isInWishlist = wishlistItems.includes(item.product?._id)

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(item.product?._id))
      toast.success("Removed from wishlist")
    } else {
      dispatch(addToWishlist(item.product?._id))
      toast.success("Added to wishlist")
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Product Image */}
          <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
            <Image
              src={item.product?.images[0] || "/placeholder.svg?height=96&width=96"}
              alt={item.product?.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Link
                  href={`/products/${item.product?.slug}`}
                  className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary line-clamp-2"
                >
                  {item.product?.title}
                </Link>
                <Badge variant="secondary" className="mt-1">
                  {item.product?.category}
                </Badge>
                <div className="flex items-center mt-2">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">${item.product?.price}</span>
                  {item.product?.comparePrice && item.product?.comparePrice > item.product?.price && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ${item.product?.comparePrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleWishlistToggle}
                  className={isInWishlist ? "text-red-500 hover:text-red-600" : ""}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onRemove(item.product?._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.product?._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-4 py-1 border-x min-w-[3rem] text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.product?._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product?.inventory}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                {item.product?.inventory <= 5 && (
                  <Badge variant="destructive" className="text-xs">
                    Only {item.product?.inventory} left
                  </Badge>
                )}
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${(item.product?.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
