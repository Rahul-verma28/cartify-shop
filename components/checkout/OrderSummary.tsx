"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { CartItem } from "@/types"

interface OrderSummaryProps {
  items: CartItem[]
  total: number
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  const subtotal = total
  const shipping = total > 100 ? 0 : 10
  const tax = total * 0.08
  const finalTotal = subtotal + shipping + tax

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.product?._id} className="flex items-center space-x-4">
            <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={item.product?.images[0] || "/placeholder.svg?height=64&width=64"}
                alt={item.product?.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.product?.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              ${(item.product?.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Shipping</span>
          <span className="text-gray-900 dark:text-white">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tax</span>
          <span className="text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-gray-900 dark:text-white">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {shipping === 0 && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">🎉 You qualify for free shipping!</p>
        </div>
      )}
    </motion.div>
  )
}
