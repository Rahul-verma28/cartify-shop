import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoDB';
import Product from '@/lib/models/Product';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log("Fetching product:", resolvedParams.slug);
    await connectDB();
    
    const product = await Product.findOne({ slug: resolvedParams.slug }).lean();
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Convert MongoDB document to plain object
    const serializedProduct = JSON.parse(JSON.stringify(product));
    
    return NextResponse.json(serializedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
