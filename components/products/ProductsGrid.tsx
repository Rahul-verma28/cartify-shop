"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import {
  setProducts,
  setLoading,
  setError,
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
  const { products, filters, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(""));

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(filters.category && { category: filters.category }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
      });

      const response = await fetch(`/api/products?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (page === 1) {
        dispatch(setProducts(data.products));
      } else {
        dispatch(setProducts([...products, ...data.products]));
      }

      setHasMore(data.pagination.page < data.pagination.pages);
    } catch (error) {
      dispatch(setError("Failed to fetch products"));
      console.error("Error fetching products:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSortChange = (value: string) => {
    dispatch({ type: "products/updateFilters", payload: { sortBy: value } });
    setPage(1);
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
          onClick={() => fetchProducts()}
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
          <Badge variant="secondary" className="text-sm">
            {products?.length} items
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">
            Sort by:
          </span>
          <Select
            value={filters.sortBy || "newest"}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
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
        {products?.map((product: Product, index: number) => (
          <motion.div
            key={product?._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
          >
            <ProductCard product={product} showDescription={false} showCategory={false}/>
          </motion.div>
        ))}
      </motion.div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={loadMore}
            disabled={loading}
            variant="outline"
            size="lg"
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
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
