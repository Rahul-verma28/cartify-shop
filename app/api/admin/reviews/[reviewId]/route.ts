import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongoDB"
import Review from "@/lib/models/Review"
import Product from "@/lib/models/Product"
import { authOptions } from "@/lib/auth"

export async function DELETE(request: NextRequest, { params }: { params: { reviewId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const review = await Review.findByIdAndDelete(params?.reviewId)

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Update product's average rating and count
    const productReviews = await Review.find({ product: review?.product })
    const newAverageRating =
      productReviews.length > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length : 0

    await Product.findByIdAndUpdate(review?.product, {
      "rating.average": newAverageRating,
      "rating.count": productReviews.length,
    })

    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
