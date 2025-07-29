// import { type NextRequest, NextResponse } from "next/server"
// import connectDB from "@/lib/mongoDB"
// import Collection from "@/lib/models/Collection"

// export async function GET(request: NextRequest) {
//   try {
//     await connectDB()

//     const { searchParams } = new URL(request.url)
//     const limit = parseInt(searchParams.get("limit") || "10")
//     const page = parseInt(searchParams.get("page") || "1")
//     const skip = (page - 1) * limit

//     const collections = await Collection.find({})
//       .populate("products", "title slug price images rating inventory")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean()

//     const total = await Collection.countDocuments({})

//     return NextResponse.json({
//       collections,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     })
//   } catch (error) {
//     console.error("Error fetching collections:", error)
//     return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
//   }
// }



import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoDB"
import Collection from "@/lib/models/Collection"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const simple = searchParams.get('simple') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    // Add timeout to database query
    const collections = await Promise.race([
      Collection.find({})
        .select(simple ? 'title slug description image' : '')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 10000)
      )
    ]) as any[];

    // Ensure all collections have required fields
    const processedCollections = collections.map(collection => ({
      ...collection,
      _id: collection._id.toString(),
      slug: collection.slug || collection.title?.toLowerCase().replace(/\s+/g, '-') || 'collection',
      image: collection.image || '/placeholder.svg'
    }));

    return NextResponse.json({
      collections: processedCollections,
      count: processedCollections.length,
      message: 'Collections retrieved successfully'
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });

  } catch (error: any) {
    console.error("Error fetching collections:", error);
    
    // Return fallback data instead of error in production
    const fallbackCollections = [
      {
        _id: 'fallback-1',
        title: 'New Arrivals',
        slug: 'new-arrivals',
        description: 'Latest products just in',
        image: '/placeholder.svg'
      },
      {
        _id: 'fallback-2',
        title: 'Best Sellers',
        slug: 'best-sellers',
        description: 'Most popular items',
        image: '/placeholder.svg'
      },
      {
        _id: 'fallback-3',
        title: 'Sale Items',
        slug: 'sale',
        description: 'Great deals and discounts',
        image: '/placeholder.svg'
      }
    ];

    return NextResponse.json({
      collections: fallbackCollections,
      count: fallbackCollections.length,
      message: 'Using fallback collections due to server error',
      fallback: true
    }, {
      status: 200, // Return 200 instead of error to prevent client failures
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  }
}
