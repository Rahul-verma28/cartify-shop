import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoDB"
import Product from "@/lib/models/Product"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const order = searchParams.get("order") || "desc"

    // Build query
    const query: any = {}

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$text = { $search: search }
    }

    // Build sort object
    const sort: any = {}
    sort[sortBy] = order === "desc" ? -1 : 1

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product?.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Product?.countDocuments(query),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()

    const product = new Product(body)
    await product?.save()

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
