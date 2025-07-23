import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import  Product from "@/schemas/Product"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const categories = searchParams.get("categories")?.split(",") || []
    const limit = Number.parseInt(searchParams.get("limit") || "4")
    const excludeIds = searchParams.get("exclude")?.split(",") || []

    const query: any = {}

    // If categories provided, prioritize those
    if (categories.length > 0 && categories[0] !== "") {
      query.category = { $in: categories }
    }

    // Exclude specific products (e.g., already in cart)
    if (excludeIds.length > 0) {
      query._id = { $nin: excludeIds }
    }

    // Get recommendations with high ratings and good inventory
    const products = await Product?.find({
      ...query,
      inventory: { $gt: 0 },
      "rating.average": { $gte: 3.5 },
    })
      .sort({
        "rating.average": -1,
        "rating.count": -1,
        createdAt: -1,
      })
      .limit(limit * 2) // Get more to have variety
      .lean()

    // If not enough products from categories, get popular products
    if (products?.length < limit) {
      const additionalProducts = await Product?.find({
        _id: { $nin: [...excludeIds, ...products?.map((p) => p._id)] },
        inventory: { $gt: 0 },
      })
        .sort({
          "rating.average": -1,
          "rating.count": -1,
        })
        .limit(limit - products?.length)
        .lean()

      products?.push(...additionalProducts)
    }

    // Shuffle and limit results
    const shuffled = products?.sort(() => Math.random() - 0.5).slice(0, limit)

    return NextResponse.json({
      success: true,
      products: shuffled.map((product) => ({
        ...product,
        _id: Product?._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
