import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongoDB";
import Category from "@/lib/models/Category";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB();

    const categories = await Category.find({}).sort({ title: 1 }).lean();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB();

    const { title, slug, description, image } = await request.json();

    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: "Title , slug, and description are required" },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findOne({
      $or: [{ title }, { slug }],
    });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this title or slug already exists" },
        { status: 400 }
      );
    }

    const category = new Category({ title, slug, description, image });
    await category.save();

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
