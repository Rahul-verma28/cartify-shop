import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongoDB"
import Product from "@/lib/models/Product"
import Collection from "@/lib/models/Collection"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { productId } = await params
    const product = await Product?.findById(productId).lean()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const productData = await request.json()
    const { productId } = await params

    // Get the original product to compare collections
    const originalProduct = await Product.findById(productId)
    if (!originalProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    const oldCollectionIds = originalProduct.collections.map((id) => id.toString())

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true, runValidators: true })
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    const newCollectionIds = updatedProduct.collections.map((id) => id.toString())

    // Determine which collections to add/remove the product from
    const collectionsToAdd = newCollectionIds.filter((id) => !oldCollectionIds.includes(id))
    const collectionsToRemove = oldCollectionIds.filter((id) => !newCollectionIds.includes(id))

    // Update collections
    if (collectionsToAdd.length > 0) {
      await Collection.updateMany({ _id: { $in: collectionsToAdd } }, { $addToSet: { products: updatedProduct._id } })
    }
    if (collectionsToRemove.length > 0) {
      await Collection.updateMany({ _id: { $in: collectionsToRemove } }, { $pull: { products: updatedProduct._id } })
    }

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { productId } = await params
    const product = await Product.findByIdAndDelete(productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Remove product from any collections it was in
    if (product.collections && product.collections.length > 0) {
      await Collection.updateMany(
        { _id: { $in: product.collections } },
        { $pull: { products: product._id } }
      )
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
