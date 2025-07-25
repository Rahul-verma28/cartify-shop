import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongoDB"
import Order from "@/lib/models/Order"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    await connectDB()

    // Get top products by sales volume
    const topProducts = await Order.aggregate([
      { $match: { status: { $in: ["paid", "shipped", "delivered"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: "$product?._id",
          title: "$product?.title",
          image: { $arrayElemAt: ["$product?.images", 0] },
          sales: 1,
          revenue: 1,
        },
      },
    ])

    return NextResponse.json({ products: topProducts })
  } catch (error) {
    console.error("Error fetching top products:", error)
    return NextResponse.json({ error: "Failed to fetch top products" }, { status: 500 })
  }
}
