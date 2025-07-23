import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product, FilterState } from "@/types"

interface ProductsState {
  products: Product[]
  featuredProducts: Product[]
  filters: FilterState
  loading: boolean
  error: string | null
}

const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  filters: {
    category: "",
    priceRange: [0, 1000],
    rating: 0,
    tags: [],
    sortBy: "newest",
  },
  loading: false,
  error: null,
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
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
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const { setProducts, setFeaturedProducts, setLoading, setError, updateFilters, resetFilters } =
  productsSlice.actions
export default productsSlice.reducer
