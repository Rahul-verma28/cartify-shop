"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import {
  ArrowLeft,
  Package,
  Star,
  Search,
  Filter,
  Grid3X3,
  List,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Award,
  Users,
} from "lucide-react";
import type { Category, Product } from "@/lib/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

function CategorySkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden">
        <Skeleton className="absolute inset-0 h-80" />
        <div className="relative container mx-auto px-4 py-16">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="max-w-3xl">
            <Skeleton className="h-12 w-96 mb-4" />
            <Skeleton className="h-6 w-80 mb-6" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Skeleton */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
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
    </div>
  );
}

interface FilterOptions {
  search: string;
  sortBy: string;
  priceRange: string;
  rating: string;
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    sortBy: "newest",
    priceRange: "all",
    rating: "all",
  });

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [slug]);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch category
      const categoryResponse = await fetch(`/api/categories/${slug}`);
      if (!categoryResponse.ok) {
        if (categoryResponse.status === 404) {
          notFound();
        }
        throw new Error("Failed to fetch category");
      }
      const categoryData = await categoryResponse.json();
      setCategory(categoryData);
      console.log("Category loaded:", categoryData);

      // Fetch products in this category
      const productsResponse = await fetch(
        `/api/products?category=${categoryData.title.toLowerCase()}&limit=100`
      );
      if (!productsResponse.ok) throw new Error("Failed to fetch products");
      const productsData = await productsResponse.json();
      console.log("Products data:", productsData);
      setProducts(productsData.products || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    // Rating filter
    if (filters.rating !== "all") {
      const minRating = Number(filters.rating);
      filtered = filtered.filter(
        (product) => product.rating.average >= minRating
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating.average - a.rating.average;
        case "popular":
          return b.rating.count - a.rating.count;
        case "name":
          return a.title.localeCompare(b.title);
        default: // newest
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <CategorySkeleton />;
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The requested category could not be found."}
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryStats = {
    totalProducts: products.length,
    avgRating:
      products.length > 0
        ? products.reduce((sum, p) => sum + p.rating.average, 0) /
          products.length
        : 0,
    totalReviews: products.reduce((sum, p) => sum + p.rating.count, 0),
    priceRange:
      products.length > 0
        ? {
            min: Math.min(...products.map((p) => p.price)),
            max: Math.max(...products.map((p) => p.price)),
          }
        : { min: 0, max: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          {category.image && (
            <Image
              src={category.image.trim() || "/placeholder.svg"}
              alt={category.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent dark:from-black/70"></div>

        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-4 mb-6"
          >
            <Link href="/">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30 border-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/60"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent">
              {category.title}
            </h1>

            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              {category.description ||
                `Explore our collection of ${category.title.toLowerCase()} products`}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2 bg-white/10 dark:bg-gray-800/30 rounded-full px-4 py-2">
                <Package className="w-5 h-5 text-blue-300 dark:text-blue-400" />
                <span className="font-medium">
                  {categoryStats.totalProducts} Products
                </span>
              </div>

              {categoryStats.avgRating > 0 && (
                <div className="flex items-center space-x-2 bg-white/10 dark:bg-gray-800/30 rounded-full px-4 py-2">
                  <Star className="w-5 h-5 fill-current text-yellow-400" />
                  <span className="font-medium">
                    {categoryStats.avgRating.toFixed(1)} avg rating
                  </span>
                </div>
              )}

              {categoryStats.priceRange.min > 0 && (
                <div className="flex items-center space-x-2 bg-white/10 dark:bg-gray-800/30 rounded-full px-4 py-2">
                  <TrendingUp className="w-5 h-5 text-green-300 dark:text-green-400" />
                  <span className="font-medium">
                    ${categoryStats.priceRange.min} - $
                    {categoryStats.priceRange.max}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex flex-wrap gap-4 flex-1">
              {/* Search */}
              <div className="relative min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Sort */}
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger className="w-48 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectItem value="newest" className="text-gray-900 dark:text-gray-100">Newest First</SelectItem>
                  <SelectItem value="price-low" className="text-gray-900 dark:text-gray-100">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="text-gray-900 dark:text-gray-100">Price: High to Low</SelectItem>
                  <SelectItem value="rating" className="text-gray-900 dark:text-gray-100">Highest Rated</SelectItem>
                  <SelectItem value="popular" className="text-gray-900 dark:text-gray-100">Most Popular</SelectItem>
                  <SelectItem value="name" className="text-gray-900 dark:text-gray-100">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range */}
              <Select
                value={filters.priceRange}
                onValueChange={(value) =>
                  handleFilterChange("priceRange", value)
                }
              >
                <SelectTrigger className="w-40 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectItem value="all" className="text-gray-900 dark:text-gray-100">All Prices</SelectItem>
                  <SelectItem value="0-25" className="text-gray-900 dark:text-gray-100">Under $25</SelectItem>
                  <SelectItem value="25-50" className="text-gray-900 dark:text-gray-100">$25 - $50</SelectItem>
                  <SelectItem value="50-100" className="text-gray-900 dark:text-gray-100">$50 - $100</SelectItem>
                  <SelectItem value="100-200" className="text-gray-900 dark:text-gray-100">$100 - $200</SelectItem>
                  <SelectItem value="200" className="text-gray-900 dark:text-gray-100">Over $200</SelectItem>
                </SelectContent>
              </Select>

              {/* Rating */}
              <Select
                value={filters.rating}
                onValueChange={(value) => handleFilterChange("rating", value)}
              >
                <SelectTrigger className="w-32 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectItem value="all" className="text-gray-900 dark:text-gray-100">All Ratings</SelectItem>
                  <SelectItem value="4" className="text-gray-900 dark:text-gray-100">4+ Stars</SelectItem>
                  <SelectItem value="3" className="text-gray-900 dark:text-gray-100">3+ Stars</SelectItem>
                  <SelectItem value="2" className="text-gray-900 dark:text-gray-100">2+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
            {filters.search && ` for "${filters.search}"`}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <Package className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {filters.search ||
                filters.priceRange !== "all" ||
                filters.rating !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "We're working on adding products to this category."}
              </p>
              {(filters.search ||
                filters.priceRange !== "all" ||
                filters.rating !== "all") && (
                <Button
                  onClick={() =>
                    setFilters({
                      search: "",
                      sortBy: "newest",
                      priceRange: "all",
                      rating: "all",
                    })
                  }
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  showDescription={true}
                  showCategory={false}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Features */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Why Shop {category.title}?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the benefits of our {category.title.toLowerCase()}{" "}
              collection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hand-selected products that meet our high standards for quality
                and performance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Customer Approved</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Products loved by thousands of customers with verified reviews
                and ratings.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Best Value</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Competitive prices and regular promotions to ensure you get the
                best deals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
