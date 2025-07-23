"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/store"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CheckoutForm from "@/components/checkout/CheckoutForm"
import OrderSummary from "@/components/checkout/OrderSummary"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const dispatch = useDispatch()
  const { items, total } = useSelector((state: RootState) => state.cart)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (items.length === 0) {
      router.push("/")
    }
  }, [items, router])

  const handleCheckout = async (shippingData: any) => {
    setLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product?._id,
            quantity: item.quantity,
            price: item.product?.price,
          })),
          shippingAddress: shippingData,
          total,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to Stripe Checkout
        const stripe = await import("@stripe/stripe-js").then((m) =>
          m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!),
        )

        if (stripe) {
          await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          })
        }
      } else {
        toast.error(data.error || "Checkout failed")
      }
    } catch (error) {
      toast.error("An error occurred during checkout")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <CheckoutForm onSubmit={handleCheckout} loading={loading} />
            </div>
            <div>
              <OrderSummary items={items} total={total} />
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
