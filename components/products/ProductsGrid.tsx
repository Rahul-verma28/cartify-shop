"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { setProducts, setLoading, setError } from "@/lib/redux/slices/productsSlice"
import ProductCard from "@/components/ProductCard"
import type { Product } from "@/lib/types"
import { motion } from "framer-motion"

export default function ProductsGrid() {
  const dispatch = useDispatch()
  const { products, filters, loading } = useSelector((state: RootState) => state.products)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [filters, page])

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true))

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(filters.category && { category: filters.category }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
      })

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

      if (page === 1) {
        dispatch(setProducts(data.products))
      } else {
        dispatch(setProducts([...products, ...data.products]))
      }

      setHasMore(data.pagination.page < data.pagination.pages)
    } catch (error) {
      dispatch(setError("Failed to fetch products"))
    }
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1)
    }
  }

  if (loading && products?.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 dark:bg-gray-800 aspect-square rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products ({products?.length})</h1>
        <select
          value={filters.sortBy}
          onChange={(e) => dispatch({ type: "products/updateFilters", payload: { sortBy: e.target.value } })}
          className="input-field"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {products?.map((product: Product, index: number) => (
          <motion.div
            key={product?._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {hasMore && (
        <div className="text-center mt-8">
          <button onClick={loadMore} disabled={loading} className="btn-primary">
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  )
}
