import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/db"
import Product from "@/schemas/Product"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search")
    const category = searchParams.get("category")

    const query: any = {}

    if (search) {
      query.$text = { $search: search }
    }

    if (category && category !== "all") {
      query.category = category
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product?.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
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
    console.error("Error fetching admin products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    await connectDB()

    const productData = await request.json()

    // Validate required fields
    if (
      !productData.title ||
      !productData.slug ||
      !productData.description ||
      !productData.price ||
      !productData.category
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if slug already exists
    const existingProduct = await Product?.findOne({ slug: productData.slug })
    if (existingProduct) {
      return NextResponse.json({ error: "Product with this slug already exists" }, { status: 400 })
    }

    const product = new Product(productData)
    await product?.save()

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
