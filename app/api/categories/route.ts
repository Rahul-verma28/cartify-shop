import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoDB"
import Category from "@/lib/models/Category"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const categories = await Category.find({})
      .sort({ title: 1 })
      .limit(limit)
      .lean()

    return NextResponse.json({
      categories,
      count: categories.length,
      message: 'Categories retrieved successfully'
    })

  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
