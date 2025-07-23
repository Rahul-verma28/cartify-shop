import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Product } from "@/schemas/Product"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const ids = searchParams.get("ids")?.split(",") || []

    if (ids.length === 0 || ids.length > 4) {
      return NextResponse.json(
        { success: false, error: "Please provide 1-4 product IDs for comparison" },
        { status: 400 },
      )
    }

    const products = await product?.find({
      _id: { $in: ids },
    }).lean()

    if (products?.length !== ids.length) {
      return NextResponse.json({ success: false, error: "Some products not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      products: products?.map((product) => ({
        ...product,
        _id: product?._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching products for comparison:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products for comparison" }, { status: 500 })
  }
}
