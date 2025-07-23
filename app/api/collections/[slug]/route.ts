import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Collection from "@/schemas/Collection"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const collection = await Collection.findOne({ slug: params.slug })
      .populate("products", "title slug price images rating inventory comparePrice featured")
      .lean()

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json({ collection })
  } catch (error) {
    console.error("Error fetching collection:", error)
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 })
  }
}
