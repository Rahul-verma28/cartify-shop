import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongoDB";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;

    const reviews = await Review?.find({ product: resolvedParams?.productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const resolvedParams = await params;

    const { rating, comment } = await request.json();

    // Check if user already reviewed this product
    // const existingReview = await Review?.findOne({
    //   user: session.user.id,
    //   product: resolvedParams?.productId,
    // })

    // if (existingReview) {
    //   return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    // }

    // Create new review
    const review = new Review({
      user: session.user.id,
      product: resolvedParams?.productId,
      rating,
      comment,
    });

    await review?.save();

    // Update product rating
    const reviews = await Review?.find({ product: resolvedParams?.productId });
    const averageRating =
      reviews?.reduce((sum, r) => sum + r.rating, 0) / reviews?.length;

    await Product?.findByIdAndUpdate(resolvedParams?.productId, {
      "rating.average": averageRating,
      "rating.count": reviews?.length,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const resolvedParams = await params;

    const { reviewId, rating, comment } = await request.json();

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    // Find the review and check if it belongs to the current user
    const existingReview = await Review?.findOne({
      _id: reviewId,
      user: session.user.id,
      product: resolvedParams?.productId,
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found or you don't have permission to edit this review" },
        { status: 404 }
      );
    }

    // Update the review
    const updatedReview = await Review?.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    // Recalculate product rating
    const reviews = await Review?.find({ product: resolvedParams?.productId });
    const averageRating =
      reviews?.reduce((sum, r) => sum + r.rating, 0) / reviews?.length;

    await Product?.findByIdAndUpdate(resolvedParams?.productId, {
      "rating.average": averageRating,
      "rating.count": reviews?.length,
    });

    return NextResponse.json({ review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const resolvedParams = await params;

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    // Find the review and check if it belongs to the current user
    const existingReview = await Review?.findOne({
      _id: reviewId,
      user: session.user.id,
      product: resolvedParams?.productId,
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found or you don't have permission to delete this review" },
        { status: 404 }
      );
    }

    // Delete the review
    await Review?.findByIdAndDelete(reviewId);

    // Recalculate product rating
    const reviews = await Review?.find({ product: resolvedParams?.productId });
    
    if (reviews?.length > 0) {
      const averageRating =
        reviews?.reduce((sum, r) => sum + r.rating, 0) / reviews?.length;

      await Product?.findByIdAndUpdate(resolvedParams?.productId, {
        "rating.average": averageRating,
        "rating.count": reviews?.length,
      });
    } else {
      // No reviews left, reset rating
      await Product?.findByIdAndUpdate(resolvedParams?.productId, {
        "rating.average": 0,
        "rating.count": 0,
      });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
