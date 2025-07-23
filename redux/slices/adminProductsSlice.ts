import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "@/types"

interface AdminProductsState {
  products: Product[]
  loading: boolean
  error: string | null
  searchTerm: string
  selectedCategory: string
  totalProducts: number
  currentPage: number
  itemsPerPage: number
}

const initialState: AdminProductsState = {
  products: [],
  loading: false,
  error: null,
  searchTerm: "",
  selectedCategory: "",
  totalProducts: 0,
  currentPage: 1,
  itemsPerPage: 10,
}

// Async thunks for admin product operations
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/products")
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      return data.products || []
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch products")
    }
  }
)

export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete product")
      }
      return productId
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete product")
    }
  }
)

export const createAdminProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData: Partial<Product>, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })
      if (!response.ok) {
        throw new Error("Failed to create product")
      }
      const data = await response.json()
      return data.product
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create product")
    }
  }
)

export const updateAdminProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ productId, productData }: { productId: string; productData: Partial<Product> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })
      if (!response.ok) {
        throw new Error("Failed to update product")
      }
      const data = await response.json()
      return data.product
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update product")
    }
  }
)

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
      state.currentPage = 1 // Reset to first page when searching
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
      state.currentPage = 1 // Reset to first page when filtering
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload
      state.currentPage = 1 // Reset to first page when changing items per page
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
        state.totalProducts = action.payload.length
        state.error = null
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete product
      .addCase(deleteAdminProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products = state.products.filter((product) => product._id !== action.payload)
        state.totalProducts = state.products.length
        state.error = null
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create product
      .addCase(createAdminProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products.unshift(action.payload)
        state.totalProducts = state.products.length
        state.error = null
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update product
      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.products.findIndex((product) => product._id === action.payload._id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setSearchTerm, setSelectedCategory, setCurrentPage, setItemsPerPage, clearError } =
  adminProductsSlice.actions

// Selectors
export const selectFilteredProducts = (state: { adminProducts: AdminProductsState }) => {
  const { products, searchTerm, selectedCategory } = state.adminProducts
  return products.filter((product) => {
    const matchesSearch = product?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product?.category === selectedCategory
    return matchesSearch && matchesCategory
  })
}

export const selectPaginatedProducts = (state: { adminProducts: AdminProductsState }) => {
  const filteredProducts = selectFilteredProducts(state)
  const { currentPage, itemsPerPage } = state.adminProducts
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredProducts.slice(startIndex, endIndex)
}

export const selectTotalPages = (state: { adminProducts: AdminProductsState }) => {
  const filteredProducts = selectFilteredProducts(state)
  const { itemsPerPage } = state.adminProducts
  return Math.ceil(filteredProducts.length / itemsPerPage)
}

export default adminProductsSlice.reducer
