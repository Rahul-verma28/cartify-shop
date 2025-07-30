// // // import connectDB from "@/lib/mongoDB"
// // // import Product from "@/lib/models/Product"
// // // import ProductCard from "@/components/ProductCard"

// // // async function getFeaturedProducts() {
// // //   await connectDB()
// // //   const products = await Product?.find({ featured: true }).limit(8).lean()
// // //   return JSON.parse(JSON.stringify(products))
// // // }

// // // export default async function FeaturedProducts() {
// // //   const products = await getFeaturedProducts()

// // //   return (
// // //     <section className="py-16 bg-white dark:bg-gray-950">
// // //       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
// // //         <div className="text-center mb-12">
// // //           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
// // //           <p className="text-lg text-gray-600 dark:text-gray-300">
// // //             Discover our handpicked selection of premium products
// // //           </p>
// // //         </div>

// // //         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// // //           {products?.map((product: any) => (
// // //             <ProductCard key={product?._id} product={product} />
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </section>
// // //   )
// // // }



"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import connectDB from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  size?: string[];
  color?: string[];
  collections?: string[];
  inventory: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function FeaturedProductsSkeleton() {
  return (
    <section id="featured" className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton className="h-9 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-9 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

async function getFeaturedProducts() {
  await connectDB();
  const products = await Product?.find({ featured: true })
    .sort({
      createdAt: -1, // Latest first
      "rating.average": -1, // Then by highest rating
      "rating.count": -1, // Then by most reviews
    })
    .limit(8)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/products?featured=true&limit=12&sort=latest"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch featured products");
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error: any) {
      console.error("Error fetching featured products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FeaturedProductsSkeleton />;
  }

  if (error) {
    return (
      <section id="featured" className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-red-500">
              Failed to load featured products. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured" className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover our handpicked selection of premium products - latest
            arrivals first
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product: Product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}



// import Product from "@/lib/models/Product";
// import connectDB from "@/lib/mongoDB";
// import ProductCard from "../ProductCard";

// async function getFeaturedProducts() {
//   await connectDB();
//   const products = await Product?.find({ featured: true })
//     .sort({
//       createdAt: -1, // Latest first
//       "rating.average": -1, // Then by highest rating
//       "rating.count": -1, // Then by most reviews
//     })
//     .limit(8)
//     .lean();
//   return JSON.parse(JSON.stringify(products));
// }

// export default async function FeaturedProducts() {
//   const products = await getFeaturedProducts();

//   return (
//     <section className="py-16 bg-white dark:bg-gray-950">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//             Featured Products
//           </h2>
//           <p className="text-lg text-gray-600 dark:text-gray-300">
//             Discover our handpicked selection of premium products
//           </p>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products?.map((product: any) => (
//             <ProductCard key={product?._id} product={product} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


// import Product from "@/lib/models/Product";
// import connectDB from "@/lib/mongoDB";
// import ProductCard from "../ProductCard";

// // Fallback products in case of database issues
// const fallbackProducts = [
//   {
//     _id: 'fallback-1',
//     title: 'Premium Wireless Headphones',
//     slug: 'premium-wireless-headphones',
//     description: 'High-quality wireless headphones with noise cancellation',
//     price: 299.99,
//     comparePrice: 399.99,
//     images: ['/placeholder.svg'],
//     category: 'Electronics',
//     tags: ['audio', 'wireless', 'premium'],
//     rating: { average: 4.5, count: 128 },
//     inventory: 50,
//     featured: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     _id: 'fallback-2',
//     title: 'Smart Watch Pro',
//     slug: 'smart-watch-pro',
//     description: 'Advanced fitness tracking and smart features',
//     price: 399.99,
//     comparePrice: 499.99,
//     images: ['/placeholder.svg'],
//     category: 'Electronics',
//     tags: ['wearable', 'fitness', 'smart'],
//     rating: { average: 4.7, count: 95 },
//     inventory: 30,
//     featured: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     _id: 'fallback-3',
//     title: 'Laptop Stand Aluminum',
//     slug: 'laptop-stand-aluminum',
//     description: 'Ergonomic aluminum laptop stand for better posture',
//     price: 79.99,
//     comparePrice: 99.99,
//     images: ['/placeholder.svg'],
//     category: 'Accessories',
//     tags: ['laptop', 'ergonomic', 'aluminum'],
//     rating: { average: 4.3, count: 67 },
//     inventory: 75,
//     featured: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     _id: 'fallback-4',
//     title: 'Wireless Charging Pad',
//     slug: 'wireless-charging-pad',
//     description: 'Fast wireless charging pad for all Qi-enabled devices',
//     price: 49.99,
//     comparePrice: 69.99,
//     images: ['/placeholder.svg'],
//     category: 'Electronics',
//     tags: ['wireless', 'charging', 'fast'],
//     rating: { average: 4.4, count: 89 },
//     inventory: 120,
//     featured: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   }
// ];

// async function getFeaturedProducts() {
//   try {
//     // Add timeout to database connection
//     const timeoutPromise = new Promise((_, reject) =>
//       setTimeout(() => reject(new Error('Database connection timeout')), 10000)
//     );

//     const dbPromise = (async () => {
//       await connectDB();
//       const products = await Product?.find({ featured: true })
//         .sort({
//           createdAt: -1, // Latest first
//           "rating.average": -1, // Then by highest rating
//           "rating.count": -1, // Then by most reviews
//         })
//         .limit(8)
//         .lean();
//       return JSON.parse(JSON.stringify(products));
//     })();

//     const products = await Promise.race([dbPromise, timeoutPromise]);
    
//     // If we get valid products, return them
//     if (Array.isArray(products) && products.length > 0) {
//       return products;
//     }
    
//     // Otherwise return fallback
//     console.warn('No featured products found in database, using fallback');
//     return fallbackProducts;
    
//   } catch (error) {
//     console.error('Error fetching featured products:', error);
//     // Return fallback products on any error
//     return fallbackProducts;
//   }
// }

// export default async function FeaturedProducts() {
//   const products = await getFeaturedProducts();
//   const isFallback = products.some((p: any) => p._id.startsWith('fallback-'));

//   return (
//     <section id="featured" className="py-16 bg-white dark:bg-gray-950">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//             Featured Products
//           </h2>
//           <p className="text-lg text-gray-600 dark:text-gray-300">
//             Discover our handpicked selection of premium products
//           </p>
//           {isFallback && (
//             <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
//               ⚠️ Showing sample products - Database may be temporarily unavailable
//             </p>
//           )}
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products?.map((product: any) => (
//             <ProductCard key={product?._id} product={product} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
