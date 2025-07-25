import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoDB"
import { Product } from "@/lib/models/Product"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const category = searchParams.get("category") || ""
    const minPrice = Number.parseFloat(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseFloat(searchParams.get("maxPrice") || "10000")
    const rating = Number.parseFloat(searchParams.get("rating") || "0")
    const sortBy = searchParams.get("sortBy") || "relevance"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    // Build search query
    const searchQuery: any = {}

    // Text search
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ]
    }

    // Category filter
    if (category) {
      searchQuery.category = category
    }

    // Price range filter
    searchQuery.price = { $gte: minPrice, $lte: maxPrice }

    // Rating filter
    if (rating > 0) {
      searchQuery["rating.average"] = { $gte: rating }
    }

    // Build sort query
    let sortQuery: any = {}
    switch (sortBy) {
      case "price-low":
        sortQuery = { price: 1 }
        break
      case "price-high":
        sortQuery = { price: -1 }
        break
      case "rating":
        sortQuery = { "rating.average": -1, "rating.count": -1 }
        break
      case "newest":
        sortQuery = { createdAt: -1 }
        break
      default: // relevance
        if (query) {
          // For text search, sort by relevance score
          sortQuery = { score: { $meta: "textScore" } }
          searchQuery.$text = { $search: query }
        } else {
          sortQuery = { "rating.average": -1, createdAt: -1 }
        }
    }

    // Execute search with pagination
    const skip = (page - 1) * limit

    const [products, totalCount] = await Promise.all([
      product?.find(searchQuery).sort(sortQuery).skip(skip).limit(limit).lean(),
      product?.countDocuments(searchQuery),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      products: products?.map((product) => ({
        ...product,
        _id: product?._id.toString(),
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Error searching products:", error)
    return NextResponse.json({ success: false, error: "Failed to search products" }, { status: 500 })
  }
}
