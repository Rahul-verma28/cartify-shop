import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/db"
import Collection from "@/schemas/Collection"
import { authOptions } from "@/lib/auth"
import mongoose from "mongoose"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid collection ID" }, { status: 400 })
    }

    const collection = await Collection.findById(params.id)
      .populate("products", "title slug price images")
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid collection ID" }, { status: 400 })
    }

    const { title, slug, description, image, products } = await request.json()

    if (!title || !slug || !image) {
      return NextResponse.json({ error: "Title, slug, and image are required" }, { status: 400 })
    }

    // Check if title or slug already exists in another collection
    const existingCollection = await Collection.findOne({
      _id: { $ne: params.id },
      $or: [{ title }, { slug }]
    })

    if (existingCollection) {
      return NextResponse.json({ error: "Collection with this title or slug already exists" }, { status: 400 })
    }

    const collection = await Collection.findByIdAndUpdate(
      params.id,
      { title, slug, description, image, products: products || [] },
      { new: true, runValidators: true }
    ).populate("products", "title slug price images")

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json({ collection })
  } catch (error) {
    console.error("Error updating collection:", error)
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid collection ID" }, { status: 400 })
    }

    const collection = await Collection.findByIdAndDelete(params.id)

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Collection deleted successfully" })
  } catch (error) {
    console.error("Error deleting collection:", error)
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 })
  }
}
