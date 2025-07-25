"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Loader2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { clearCart } from "@/lib/redux/slices/cartSlice"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [orderId, setOrderId] = useState<string | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId)
    } else {
      setStatus("failed")
    }
  }, [sessionId])

  const verifyPayment = async (id: string) => {
    try {
      const response = await fetch(`/api/checkout/verify?session_id=${id}`)
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setOrderId(data.orderId)
        dispatch(clearCart()) // Clear cart on successful order
      } else {
        setStatus("failed")
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
      setStatus("failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <Card className="text-center p-8">
          <CardHeader className="flex flex-col items-center justify-center">
            {status === "loading" && <Loader2 className="h-16 w-16 text-primary-600 animate-spin mb-4" />}
            {status === "success" && <CheckCircle className="h-16 w-16 text-green-500 mb-4" />}
            {status === "failed" && <XCircle className="h-16 w-16 text-red-500 mb-4" />}
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {status === "loading" && "Processing Your Order..."}
              {status === "success" && "Payment Successful!"}
              {status === "failed" && "Payment Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "loading" && (
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we confirm your payment and process your order.
              </p>
            )}
            {status === "success" && (
              <>
                <p className="text-gray-600 dark:text-gray-400">
                  Thank you for your purchase! Your order has been placed successfully.
                </p>
                {orderId && (
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order ID: <span className="text-primary-600">#{orderId.slice(-8)}</span>
                  </p>
                )}
                <div className="flex flex-col gap-3 mt-6">
                  <Button asChild>
                    <Link href="/account/orders">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      View My Orders
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </div>
              </>
            )}
            {status === "failed" && (
              <>
                <p className="text-gray-600 dark:text-gray-400">
                  Unfortunately, your payment could not be processed. Please try again or contact support.
                </p>
                <div className="flex flex-col gap-3 mt-6">
                  <Button asChild>
                    <Link href="/checkout">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Try Checkout Again
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
