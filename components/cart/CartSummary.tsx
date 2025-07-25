"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { CartItem } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Tag, X, Shield } from "lucide-react"

interface CartSummaryProps {
  items: CartItem[]
  total: number
}

export default function CartSummary({ items, total }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)

  const subtotal = total
  const shipping = total > 100 ? 0 : 10
  const tax = (subtotal - discount) * 0.08
  const finalTotal = subtotal + shipping + tax - discount

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(subtotal * 0.1)
      setPromoApplied(true)
    } else if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(subtotal * 0.2)
      setPromoApplied(true)
    } else {
      setDiscount(0)
      setPromoApplied(false)
    }
  }

  const handleRemovePromo = () => {
    setPromoCode("")
    setDiscount(0)
    setPromoApplied(false)
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Promo Code */}
          <div>
            <Label htmlFor="promo">Promo Code</Label>
            {!promoApplied ? (
              <div className="flex space-x-2 mt-2">
                <Input
                  id="promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                />
                <Button onClick={handleApplyPromo} disabled={!promoCode.trim()} variant="outline" size="icon">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {promoCode} applied
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleRemovePromo}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Try: SAVE10 (10% off) or WELCOME20 (20% off)</p>
          </div>

          <Separator />

          {/* Order Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="text-green-600">-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Free Shipping Notice */}
          {shipping > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Add ${(100 - subtotal).toFixed(2)} more to qualify for free shipping!
              </p>
            </div>
          )}

          {shipping === 0 && subtotal >= 100 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">🎉 You qualify for free shipping!</p>
            </div>
          )}

          {/* Checkout Button */}
          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>

          {/* Security Notice */}
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <Shield className="h-3 w-3 mr-1" />
            Secure checkout with SSL encryption
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
