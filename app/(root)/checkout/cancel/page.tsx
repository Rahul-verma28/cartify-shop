"use client"

import { motion } from "framer-motion"
import { XCircle, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <Card className="text-center p-8">
          <CardHeader className="flex flex-col items-center justify-center">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Payment Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">Your payment was cancelled. No charges have been made.</p>
            <p className="text-gray-600 dark:text-gray-400">
              You can continue shopping or try the checkout process again.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <Button asChild>
                <Link href="/cart">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Return to Cart
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
