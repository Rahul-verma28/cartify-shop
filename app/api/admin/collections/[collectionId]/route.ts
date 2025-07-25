import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoDB"
import Collection from "@/lib/models/Collection"

export async function GET(request: NextRequest, { params }: { params: Promise<{ collectionId: string }> }) {
  try {
    await connectDB()
    const resolvedParams = await params

    const collection = await Collection.findById(resolvedParams.collectionId)
      .populate("products", "title slug price images rating")
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ collectionId: string }> }) {
  try {
    await connectDB()
    const resolvedParams = await params

    const { title, slug, description, image, products } = await request.json()

    if (!title || !slug || !image) {
      return NextResponse.json({ error: "Title, slug, and image are required" }, { status: 400 })
    }

    const existingCollection = await Collection.findOne({
      $or: [{ title }, { slug }],
      _id: { $ne: resolvedParams.collectionId },
    })
    if (existingCollection) {
      return NextResponse.json({ error: "Collection with this title or slug already exists" }, { status: 400 })
    }

    const collection = await Collection.findByIdAndUpdate(
      resolvedParams.collectionId,
      { title, slug, description, image, products: products || [] },
      { new: true, runValidators: true },
    )

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    // Populate the products before returning
    await collection.populate("products", "title slug price images rating")

    return NextResponse.json({ collection })
  } catch (error) {
    console.error("Error updating collection:", error)
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ collectionId: string }> }) {
  try {
    await connectDB()
    const resolvedParams = await params

    const collection = await Collection.findByIdAndDelete(resolvedParams.collectionId)

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Collection deleted successfully" })
  } catch (error) {
    console.error("Error deleting collection:", error)
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 })
  }
}
