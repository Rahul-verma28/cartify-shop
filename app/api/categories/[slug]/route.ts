import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoDB"
import Category from "@/lib/models/Category"
import { isValidObjectId } from "mongoose"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB()

    const { slug } = await params

    // Build query to search by slug or _id
    const query: any = {}
    if (isValidObjectId(slug)) {
      query.$or = [
        { slug: slug },
        { _id: slug }
      ]
    } else {
      query.slug = slug
    }

    const category = await Category.findOne(query).lean()

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}
