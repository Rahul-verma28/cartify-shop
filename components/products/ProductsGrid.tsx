"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import {
  setProducts,
  setLoading,
  setError,
  updateFilters,
  setPagination,
} from "@/lib/redux/slices/productsSlice";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Grid3X3, AlertCircle, Package } from "lucide-react";

export default function ProductsGrid() {
  const dispatch = useDispatch();
  const { products, filters, pagination, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(""));

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.category &&
          filters.category !== "all" && { category: filters.category }),
        ...(filters.collection &&
          filters.collection !== "all" && { collection: filters.collection }),
        ...(filters.search && { search: filters.search }),
        ...(filters.featured && { featured: "true" }),
        ...(filters.priceRange[0] > 0 && {
          minPrice: filters.priceRange[0].toString(),
        }),
        ...(filters.priceRange[1] < 1000 && {
          maxPrice: filters.priceRange[1].toString(),
        }),
        ...(filters.rating > 0 && { rating: filters.rating.toString() }),
        ...(filters.size?.length && { size: filters.size.join(",") }),
        ...(filters.color?.length && { color: filters.color.join(",") }),
        ...(filters.tags?.length && { tags: filters.tags.join(",") }),
        sortBy: filters.sortBy,
        order: filters.order,
      });

      const response = await fetch(`/api/products?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      dispatch(setProducts(data));
      setHasMore(data.pagination.page < data.pagination.pages);
    } catch (error) {
      dispatch(setError("Failed to fetch products"));
      console.error("Error fetching products:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSortChange = (value: string) => {
    const [sortBy, order] = value.split("-");
    const validOrder =
      order === "asc" || order === "desc"
        ? order
        : sortBy === "newest"
        ? "desc"
        : "asc";
    dispatch(
      updateFilters({
        sortBy:
          sortBy === "newest"
            ? "createdAt"
            : sortBy === "rating"
            ? "rating.average"
            : sortBy,
        order: validOrder,
      })
    );
  };

  const goToPage = (page: number) => {
    dispatch(setPagination({ page }));
  };

  const nextPage = () => {
    if (pagination.page < pagination.pages) {
      dispatch(setPagination({ page: pagination.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      dispatch(setPagination({ page: pagination.page - 1 }));
    }
  };

  // Loading skeleton
  if (loading && products?.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    );
  }

  // Error state
  if (error && products?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {error}. Please try again later.
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!loading && products?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          We couldn't find any products matching your criteria. Try adjusting
          your filters or check back later.
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Grid3X3 className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          {loading ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <Badge variant="secondary" className="text-sm">
              {pagination.total || products?.length} items
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">
            Sort by:
          </span>
          <Select
            value={`${filters.sortBy}-${filters.order}`}
            onValueChange={handleSortChange}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating.average-desc">Highest Rated</SelectItem>
              <SelectItem value="title-asc">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {loading && pagination.page > 1 ? (
          // Show existing products with reduced opacity while loading new page
          <>
            {products?.map((product: Product, index: number) => (
              <motion.div
                key={product?._id}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <ProductCard
                  product={product}
                  showDescription={false}
                  showCategory={false}
                />
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              </motion.div>
            ))}
          </>
        ) : loading ? (
          // Show skeleton cards when initially loading
          <>
            {[...Array(pagination.limit || 12)].map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
              >
                <Card className="overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </>
        ) : (
          // Show actual products with animation
          products?.map((product: Product, index: number) => (
            <motion.div
              key={product?._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
              whileHover={{ y: -4 }}
            >
              <ProductCard
                product={product}
                showDescription={false}
                showCategory={false}
              />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination Controls */}
      {(pagination.pages > 1 || loading) && (
        <motion.div
          className="flex flex-col items-center gap-4 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Page Numbers */}
          {loading && pagination.pages === 0 ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-9 w-9" />
                ))}
              </div>
              <Skeleton className="h-9 w-16" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={prevPage}
                disabled={pagination.page === 1 || loading}
                variant="outline"
                size="sm"
              >
                {loading && pagination.page > 1 ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Previous"
                )}
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        variant={
                          pagination.page === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        className="w-8 h-8"
                        disabled={loading}
                      >
                        {loading && pagination.page === pageNum ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          pageNum
                        )}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                onClick={nextPage}
                disabled={pagination.page === pagination.pages || loading}
                variant="outline"
                size="sm"
              >
                {loading && pagination.page < pagination.pages ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          )}

          {/* Pagination Info */}
          <div className="text-sm text-muted-foreground text-center">
            {loading && pagination.total === 0 ? (
              <Skeleton className="h-4 w-48 mx-auto" />
            ) : (
              <>
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} products
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Error toast for load more */}
      {error && products?.length > 0 && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
