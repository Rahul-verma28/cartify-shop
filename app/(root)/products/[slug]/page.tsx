"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import ProductReviews from "@/components/products/ProductReviews";
import { RootState } from "@/lib/redux/store";
import RecommendedProducts from "@/components/cart/RecommendedProducts";

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

  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist?.items || []
  );
  const isInWishlist = wishlistItems.includes(product?._id);

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

  const categorySlug = product?.category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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
              href={`/category/${categorySlug}`}
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href={`/category/${categorySlug}`}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
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
            onSizeChange={setSelectedSize}
            onColorChange={setSelectedColor}
            onQuantityChange={setQuantity}
            onShare={handleShare}
          />
        </div>

        {/* Reviews Section */}
        <ProductReviews productSlug={product.slug} />
      </div>
      {/* Recommended Products */}
      <div className="pb-6 container mx-auto px-4 sm:px-6 lg:px-12">
        <RecommendedProducts cartItems={[product]} />
      </div>
    </div>
  );
}
