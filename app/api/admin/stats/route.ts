import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongoDB"
import Order from "@/lib/models/Order"
import Product from "@/lib/models/Product"
import User from "@/lib/models/User"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    await connectDB()

    // Get current month and previous month dates
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Calculate stats
    const [
      totalRevenue,
      previousRevenue,
      totalOrders,
      previousOrders,
      totalCustomers,
      previousCustomers,
      totalProducts,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: currentMonth }, status: { $in: ["paid", "shipped", "delivered"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: previousMonth, $lt: currentMonth },
            status: { $in: ["paid", "shipped", "delivered"] },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: currentMonth } }),
      Order.countDocuments({ createdAt: { $gte: previousMonth, $lt: currentMonth } }),
      User.countDocuments({ createdAt: { $gte: currentMonth } }),
      User.countDocuments({ createdAt: { $gte: previousMonth, $lt: currentMonth } }),
      Product?.countDocuments(),
    ])

    const currentRevenue = totalRevenue[0]?.total || 0
    const prevRevenue = previousRevenue[0]?.total || 0
    const revenueChange = prevRevenue > 0 ? (((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : "0"

    const ordersChange = previousOrders > 0 ? (((totalOrders - previousOrders) / previousOrders) * 100).toFixed(1) : "0"
    const customersChange =
      previousCustomers > 0 ? (((totalCustomers - previousCustomers) / previousCustomers) * 100).toFixed(1) : "0"

    const stats = [
      {
        name: "Total Revenue",
        value: `$${currentRevenue.toLocaleString()}`,
        change: `${Number(revenueChange) >= 0 ? "+" : ""}${revenueChange}%`,
        changeType: Number(revenueChange) >= 0 ? "increase" : "decrease",
        icon: "CurrencyDollarIcon",
      },
      {
        name: "Orders",
        value: totalOrders.toLocaleString(),
        change: `${Number(ordersChange) >= 0 ? "+" : ""}${ordersChange}%`,
        changeType: Number(ordersChange) >= 0 ? "increase" : "decrease",
        icon: "ShoppingBagIcon",
      },
      {
        name: "Customers",
        value: totalCustomers.toLocaleString(),
        change: `${Number(customersChange) >= 0 ? "+" : ""}${customersChange}%`,
        changeType: Number(customersChange) >= 0 ? "increase" : "decrease",
        icon: "UsersIcon",
      },
      {
        name: "Products",
        value: totalProducts?.toLocaleString(),
        change: "+5.2%",
        changeType: "increase",
        icon: "CubeIcon",
      },
    ]

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
