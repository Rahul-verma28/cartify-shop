import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongoDB"
import Collection from "@/lib/models/Collection"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    await connectDB()

    const collections = await Collection.find({})
      .populate("products", "title slug price images rating")
      .sort({ title: 1 })
      .lean()

    return NextResponse.json({ collections })
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    await connectDB()

    const { title, slug, description, image } = await request.json()

    if (!title || !slug || !image) {
      return NextResponse.json({ error: "Title, slug, and image are required" }, { status: 400 })
    }

    const existingCollection = await Collection.findOne({ $or: [{ title }, { slug }] })
    if (existingCollection) {
      return NextResponse.json({ error: "Collection with this title or slug already exists" }, { status: 400 })
    }

    const collection = new Collection({ 
      title, 
      slug, 
      description, 
      image, 
    })
    await collection.save()

    return NextResponse.json({ collection }, { status: 201 })
  } catch (error) {
    console.error("Error creating collection:", error)
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 })
  }
}
