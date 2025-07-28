"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { CartItem } from "@/lib/types"
import { ShoppingBag, Truck, Receipt, CheckCircle, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <span>Order Summary</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Items List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Items
              </h3>
              <Badge variant="secondary">{items.length}</Badge>
            </div>
            
            <ScrollArea className="h-64">
              <div className="space-y-3 pr-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product?._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={item.product?.images[0] || "/placeholder.svg?height=64&width=64"}
                        alt={item.product?.title || "Product"}
                        fill
                        className="object-cover"
                      />
                      <Badge 
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center text-xs"
                        variant="default"
                      >
                        {item.quantity}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">
                        {item.product?.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${item.product?.price?.toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        ${(item.product?.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Cost Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Cost Breakdown
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Subtotal</span>
                </div>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Shipping</span>
                </div>
                <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tax (8%)</span>
                </div>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-xl font-bold text-primary">
              ${finalTotal.toFixed(2)}
            </span>
          </div>

          {/* Free Shipping Banner */}
          {shipping === 0 && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-400">
                🎉 You qualify for free shipping! You saved $10.
              </AlertDescription>
            </Alert>
          )}

          {/* Shipping Progress */}
          {shipping > 0 && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/50">
              <Truck className="h-4 w-4 text-blue-600" />
              <AlertDescription className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-blue-700 dark:text-blue-400">
                    Free shipping at $100
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    ${(100 - subtotal).toFixed(2)} to go
                  </span>
                </div>
                <Progress 
                  value={Math.min((subtotal / 100) * 100, 100)} 
                  className="h-2"
                />
              </AlertDescription>
            </Alert>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground pt-4 border-t">
            <Shield className="h-4 w-4" />
            <span>SSL Secured Checkout</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}