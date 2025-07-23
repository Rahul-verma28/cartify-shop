"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart, DollarSign, Package } from "lucide-react"
import Link from "next/link"

interface AccountStats {
  totalOrders: number
  totalSpent: number
  wishlistItems: number
  recentOrders: any[]
}

export default function AccountOverview() {
  const [stats, setStats] = useState<AccountStats>({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccountStats()
  }, [])

  const fetchAccountStats = async () => {
    try {
      const response = await fetch("/api/account/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching account stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats?.totalOrders}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">${stats?.totalSpent.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
                  <p className="text-2xl font-bold">{stats?.wishlistItems}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Recent Orders
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/account/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats?.recentOrders.slice(0, 3).map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Order #{order._id.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
                <Button asChild className="mt-4">
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                <Link href="/wishlist" className="flex items-center space-x-3">
                  <Heart className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">View Wishlist</p>
                    <p className="text-sm text-muted-foreground">{stats?.wishlistItems} saved items</p>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                <Link href="/account/orders" className="flex items-center space-x-3">
                  <ShoppingBag className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Order History</p>
                    <p className="text-sm text-muted-foreground">{stats?.totalOrders} total orders</p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
