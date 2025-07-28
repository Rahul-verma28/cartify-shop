// import { notFound } from "next/navigation";
// import CartDrawer from "@/components/cart/CartDrawer";
// import ProductDetails from "@/components/products/ProductDetails";
// import RelatedProducts from "@/components/products/RelatedProducts";
// import connectDB from "@/lib/mongoDB";
// import Product from "@/lib/models/Product";

// interface ProductPageProps {
//   params: Promise<{
//     slug: string;
//   }>;
// }

// async function getProduct(slug: string) {
//   await connectDB();
//   const product = await Product?.findOne({ slug }).lean();
//   return product ? JSON.parse(JSON.stringify(product)) : null;
// }

// export async function generateMetadata({ params }: ProductPageProps) {
//   const resolvedParams = await params;
//   const product = await getProduct(resolvedParams.slug);

//   if (!product) {
//     return {
//       title: "Product Not Found",
//     };
//   }

//   return {
//     title: `${product?.title} - ModernShop`,
//     description: product?.description,
//     openGraph: {
//       title: product?.title,
//       description: product?.description,
//       images: product?.images,
//     },
//   };
// }

// export default async function ProductPage({ params }: ProductPageProps) {
//   const resolvedParams = await params;
//   const product = await getProduct(resolvedParams.slug);

//   if (!product) {
//     notFound();
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
//       <main>
//         <ProductDetails product={product} />
//         <RelatedProducts
//           category={product?.category}
//           currentProductId={product?._id}
//         />
//       </main>
//       <CartDrawer />
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/redux/slices/wishlistSlice";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
// import { ReviewSection } from "@/components/products/ReviewSection";
import ProductReviews from "@/components/products/ProductReviews";
import RelatedProducts from "@/components/products/RelatedProducts";
// import { ReviewSection } from "@/components/products/ReviewSection";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Move this function outside the component and make it client-safe
async function fetchProductData(slug: string) {
  try {
    const response = await fetch(`/api/products/${slug}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const dispatch = useDispatch();
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist?.items || []
  );

  useEffect(() => {
    async function fetchProduct() {
      try {
        const resolvedParams = await params;
        const productData = await fetchProductData(resolvedParams.slug);

        if (!productData) {
          // Instead of calling notFound() here, set an error state
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(productData);
        setLoading(false);

        // Check if product is in wishlist
        setIsWishlisted(
          wishlistItems.some((item) => item._id === productData._id)
        );
      } catch (error) {
        console.error("Error in fetchProduct:", error);
        setProduct(null);
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params, wishlistItems]);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Handle product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    try {
      dispatch(
        addToCart({
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || "/placeholder.svg",
          quantity: quantity,
          size: selectedSize,
          color: selectedColor,
        })
      );

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleWishlistToggle = () => {
    try {
      if (isWishlisted) {
        dispatch(removeFromWishlist(product._id));
      } else {
        dispatch(
          addToWishlist({
            _id: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || "/placeholder.svg",
          })
        );
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/category/${product.category}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize"
            >
              {product.category?.replace("-", " ")}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white truncate">
              {product.title}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href={`/category/${product.category}`}>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {product.category?.replace("-", " ")}
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Images Component */}
          <ProductImageGallery
            images={product.images}
            title={product.title}
            comparePrice={product.comparePrice}
            price={product.price}
          />

          {/* Product Info Component */}
          <ProductInfo
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            quantity={quantity}
            addedToCart={addedToCart}
            isWishlisted={isWishlisted}
            onSizeChange={setSelectedSize}
            onColorChange={setSelectedColor}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlistToggle}
            onShare={handleShare}
          />
        </div>

        {/* Reviews Section */}
        {/* <ReviewSection productId={product.slug} /> */}
        <ProductReviews productId={product._id} />
      </div>
      {/* <RelatedProducts
        category={product?.category}
        currentProductId={product?._id}
      /> */}
    </div>
  );
}
