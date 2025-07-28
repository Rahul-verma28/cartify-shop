import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongoDB";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";
import { authOptions } from "@/lib/auth";

// Helper function to get product by slug
async function getProductBySlug(slug: string) {
  const product = await Product.findOne({ slug }).select('_id');
  if (!product) {
    throw new Error('Product not found');
  }
  return product._id;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;

    // Get product ID from slug
    const productId = await getProductBySlug(resolvedParams.slug);

    const reviews = await Review?.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    
    if (error instanceof Error && error.message === 'Product not found') {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const resolvedParams = await params;

    // Get product ID from slug
    const productId = await getProductBySlug(resolvedParams.slug);

    const { rating, comment } = await request.json();

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: "Comment must be at least 10 characters long" },
        { status: 400 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await Review?.findOne({
      user: session.user.id,
      product: productId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product. You can edit your existing review instead." },
        { status: 400 }
      );
    }

    // Create new review
    const review = new Review({
      user: session.user.id,
      product: productId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    await review?.save();

    // Update product rating
    const reviews = await Review?.find({ product: productId });
    const averageRating =
      reviews?.reduce((sum, r) => sum + r.rating, 0) / reviews?.length;

    await Product?.findByIdAndUpdate(productId, {
      "rating.average": Math.round(averageRating * 100) / 100, // Round to 2 decimal places
      "rating.count": reviews?.length,
    });

    // Populate the created review for response
    const populatedReview = await Review.findById(review._id).populate("user", "name email");

    return NextResponse.json({ review: populatedReview }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    
    if (error instanceof Error && error.message === 'Product not found') {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const resolvedParams = await params;

    // Get product ID from slug
    const productId = await getProductBySlug(resolvedParams.slug);

    const { reviewId, rating, comment } = await request.json();

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: "Comment must be at least 10 characters long" },
        { status: 400 }
      );
    }

    // Find the review and check if it belongs to the current user
    const existingReview = await Review?.findOne({
      _id: reviewId,
      user: session.user.id,
      product: productId,
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
      { 
        rating: Number(rating), 
        comment: comment.trim(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    // Recalculate product rating
    const reviews = await Review?.find({ product: productId });
    const averageRating =
      reviews?.reduce((sum, r) => sum + r.rating, 0) / reviews?.length;

    await Product?.findByIdAndUpdate(productId, {
      "rating.average": Math.round(averageRating * 100) / 100,
      "rating.count": reviews?.length,
    });

    return NextResponse.json({ review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    
    if (error instanceof Error && error.message === 'Product not found') {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const resolvedParams = await params;

    // Get product ID from slug
    const productId = await getProductBySlug(resolvedParams.slug);

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    // Find the review and check if it belongs to the current user
    const existingReview = await Review?.findOne({
      _id: reviewId,
      user: session.user.id,
      product: productId,
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
    const reviews = await Review?.find({ product: productId });
    
    if (reviews?.length > 0) {
      const averageRating =
        reviews?.reduce((sum, r) => sum + r.rating, 0) / reviews?.length;

      await Product?.findByIdAndUpdate(productId, {
        "rating.average": Math.round(averageRating * 100) / 100,
        "rating.count": reviews?.length,
      });
    } else {
      // No reviews left, reset rating
      await Product?.findByIdAndUpdate(productId, {
        "rating.average": 0,
        "rating.count": 0,
      });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    
    if (error instanceof Error && error.message === 'Product not found') {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
