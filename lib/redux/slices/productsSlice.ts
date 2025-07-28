import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product, FilterState } from "@/lib/types"

interface ProductsState {
  products: Product[]
  featuredProducts: Product[]
  filters: FilterState
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  loading: boolean
  error: string | null
}

const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  filters: {
    category: "",
    collection: "",
    priceRange: [0, 1000],
    rating: 0,
    tags: [],
    size: [],
    color: [],
    featured: false,
    search: "",
    sortBy: "createdAt",
    order: "desc",
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<{ products: Product[], pagination: any }>) => {
      state.products = action.payload.products
      state.pagination = action.payload.pagination
      state.loading = false
      state.error = null
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    updateFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.page = 1 // Reset to first page when filters change
    },
    setPagination: (state, action: PayloadAction<{ page?: number, limit?: number }>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.page = 1
    },
  },
})

export const { setProducts, setFeaturedProducts, setLoading, setError, updateFilters, resetFilters, setPagination } =
  productsSlice.actions
export default productsSlice.reducer
