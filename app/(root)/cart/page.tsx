"use client"

import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import type { RootState } from "@/redux/store"
import { removeFromCart, updateQuantity, clearCart } from "@/redux/slices/cartSlice"
import CartItem from "@/components/cart/CartItem"
import CartSummary from "@/components/cart/CartSummary"
import RecommendedProducts from "@/components/cart/RecommendedProducts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CartPage() {
  const dispatch = useDispatch()
  const { items, total, itemCount } = useSelector((state: RootState) => state.cart)

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(productId))
      toast.success("Item removed from cart")
    } else {
      dispatch(updateQuantity({ productId, quantity }))
    }
  }

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId))
    toast.success("Item removed from cart")
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    toast.success("Cart cleared")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-12">
                <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Button asChild className="w-full">
                  <Link href="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <Button variant="destructive" onClick={handleClearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.product?._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CartItem item={item} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveItem} />
              </motion.div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary items={items} total={total} />
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <RecommendedProducts cartItems={items} />
        </div>
      </div>
    </div>
  )
}
