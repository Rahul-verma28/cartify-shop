import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoDB"
import Product from "@/lib/models/Product"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
    const excludeIds = searchParams.get('exclude')?.split(',').filter(Boolean) || []
    const limit = parseInt(searchParams.get('limit') || '12')
    const featured = searchParams.get('featured') === 'true'

    // Build query
    const query: any = {}

    // Exclude products already in cart
    if (excludeIds.length > 0) {
      query._id = { $nin: excludeIds }
    }

    // If categories provided, prioritize them, otherwise get popular products
    if (categories.length > 0) {
      query.category = { $in: categories }
    }

    // If featured flag is set, prioritize featured products
    if (featured) {
      query.featured = true
    }

    let products = await Product.find(query)
      .sort({ 
        featured: -1,
        'rating.average': -1,
        'rating.count': -1,
        createdAt: -1 
      })
      .limit(limit)
      .lean()

    // If we don't have enough products and categories were specified,
    // fetch more without category restriction
    if (products.length < limit && categories.length > 0) {
      const additionalQuery: any = {
        _id: { 
          $nin: [
            ...excludeIds, 
            ...products.map(p => p._id.toString())
          ] 
        }
      }

      const additionalProducts = await Product.find(additionalQuery)
        .sort({ 
          featured: -1,
          'rating.average': -1,
          'rating.count': -1 
        })
        .limit(limit - products.length)
        .lean()

      products = [...products, ...additionalProducts]
    }

    return NextResponse.json({
      products,
      count: products.length,
      message: products.length > 0 ? 'Recommendations found' : 'No recommendations available'
    })

  } catch (error) {
    console.error("Error fetching product recommendations:", error)
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    )
  }
}
