import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB  from "@/lib/mongoDB"
import Order from "@/lib/models/Order"
import User from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get user
    const user = await User.findOne({ email: session.user.email }).lean()
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Get order statistics
    const orders = await Order.find({ userId: user._id }).lean()

    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
    const wishlistItems = user.wishlist?.length || 0

    // Get recent orders (last 5)
    const recentOrders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5).lean()

    return NextResponse.json({
      success: true,
      totalOrders,
      totalSpent,
      wishlistItems,
      recentOrders: recentOrders.map((order) => ({
        ...order,
        _id: order._id.toString(),
        userId: order.userId.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching account stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch account statistics" }, { status: 500 })
  }
}
