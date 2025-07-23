import { type NextRequest, NextResponse } from "next/server"
import connectDB  from "@/lib/db"
import  Product  from "@/schemas/Product"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const ids = searchParams.get("ids")?.split(",") || []

    if (ids.length === 0) {
      return NextResponse.json({ products: [] })
    }

    const products = await Product?.find({
      _id: { $in: ids },
    }).lean()

    return NextResponse.json({
      success: true,
      products: products?.map((product) => ({
        ...product,
        _id: product?._id,
      })),
    })
  } catch (error) {
    console.error("Error fetching wishlist products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch wishlist products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { productIds } = await request.json()

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json({ success: false, error: "Invalid product IDs" }, { status: 400 })
    }

    const products = await Product?.find({
      _id: { $in: productIds },
    }).lean()

    return NextResponse.json({
      success: true,
      products: products?.map((product) => ({
        ...product,
        _id: product?._id,
      })),
    })
  } catch (error) {
    console.error("Error fetching wishlist products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch wishlist products" }, { status: 500 })
  }
}
