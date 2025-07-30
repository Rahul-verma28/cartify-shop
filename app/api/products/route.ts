import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import "@/lib/models/Collection"; // Ensure Collection model is registered before Product is used

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const collection = searchParams.get("collection");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const featured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const tags = searchParams.get("tags");

    // Build query
    const query: any = {};

    if (category && category !== "all") {
      query.category = { $regex: new RegExp(category, "i") };
    }

    if (collection && collection !== "all") {
      query.collections = collection;
    }

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number.parseFloat(minPrice);
      if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice);
    }

    if (size) {
      query.size = { $in: size.split(",") };
    }

    if (color) {
      query.color = { $in: color.split(",") };
    }

    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    // Add rating filter
    const rating = searchParams.get("rating");
    if (rating && Number.parseFloat(rating) > 0) {
      query["rating.average"] = { $gte: Number.parseFloat(rating) };
    }

    // Build sort object
    const sort: any = {};
    // Handle nested sorting for rating
    if (sortBy === "rating.average") {
      sort["rating.average"] = order === "desc" ? -1 : 1;
    } else {
      sort[sortBy] = order === "desc" ? -1 : 1;
    }

    const skip = (page - 1) * limit;

    let products: any[] = [];
    let total = 0;

    try {
      [products, total] = await Promise.all([
        Product?.find(query)
          .populate("collections", "title")
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Product?.countDocuments(query),
      ]);
    } catch (dbError) {
      console.error("Database error fetching products:", dbError);
      return NextResponse.json(
        { error: "Database error fetching products" },
        { status: 500 }
      );
    }

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const product = new Product(body);
    await product?.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
