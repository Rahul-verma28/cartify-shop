import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Category {
  _id: string
  title: string
  slug: string
  description?: string
  productCount?: number
}

interface Collection {
  image: any
  products: any
  _id: string
  title: string
  slug: string
  description?: string
}

interface NavigationState {
  categories: Category[]
  collections: Collection[]
  loading: {
    categories: boolean
    collections: boolean
  }
  error: {
    categories: string | null
    collections: string | null
  }
  lastFetched: {
    categories: number | null
    collections: number | null
  }
}

// Default fallback data
const defaultCategories: Category[] = [
  {
    _id: 'default-1',
    title: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and tech',
    productCount: 0
  },
  {
    _id: 'default-2',
    title: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    productCount: 0
  },
  {
    _id: 'default-3',
    title: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home',
    productCount: 0
  },
  {
    _id: 'default-4',
    title: 'Sports',
    slug: 'sports',
    description: 'Athletic gear and equipment',
    productCount: 0
  }
]

const defaultCollections: Collection[] = [
  {
      _id: 'default-1',
      title: 'New Arrivals',
      slug: 'new-arrivals',
      description: 'Latest products just in',
      products: undefined,
      image: undefined
  },
  {
      _id: 'default-2',
      title: 'Best Sellers',
      slug: 'best-sellers',
      description: 'Most popular items',
      products: undefined,
      image: undefined
  },
  {
      _id: 'default-3',
      title: 'Sale Items',
      slug: 'sale',
      description: 'Great deals and discounts',
      products: undefined,
      image: undefined
  }
]

const initialState: NavigationState = {
  categories: defaultCategories,
  collections: defaultCollections,
  loading: {
    categories: false,
    collections: false
  },
  error: {
    categories: null,
    collections: null
  },
  lastFetched: {
    categories: null,
    collections: null
  }
}

// Async thunks
export const fetchCategories = createAsyncThunk(
  'navigation/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/categories?limit=20')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Validate and transform data
      const categories = (data.categories || data || [])
        .filter((cat: any) => cat && cat._id && cat.title && cat.slug)
        .map((cat: any) => ({
          _id: cat._id,
          title: cat.title,
          slug: cat.slug,
          description: cat.description || '',
          productCount: cat.productCount || 0
        }))
      
      return categories.length > 0 ? categories : defaultCategories
    } catch (error: any) {
      console.error('Failed to fetch categories:', error)
      return rejectWithValue(error.message || 'Failed to fetch categories')
    }
  }
)

export const fetchCollections = createAsyncThunk(
  'navigation/fetchCollections',
  async (_, { rejectWithValue }) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout

      const response = await fetch('/api/collections?simple=true&limit=20', {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        // Add retry logic
        ...(typeof window !== 'undefined' && {
          cache: 'no-store'
        })
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Validate and transform data with better error handling
      let collections = []
      
      if (Array.isArray(data)) {
        collections = data
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.collections)) {
          collections = data.collections
        } else if (Array.isArray(data.data)) {
          collections = data.data
        }
      }
      
      // Filter and validate collections
      const validCollections = collections
        .filter((col: any) => col && col._id && col.title)
        .map((col: any) => ({
          _id: col._id,
          title: col.title,
          slug: col.slug || col.title.toLowerCase().replace(/\s+/g, '-'),
          description: col.description || '',
          image: col.image || '/placeholder.svg'
        }))
      
      // If no valid collections, return defaults but log the issue
      if (validCollections.length === 0) {
        console.warn('No valid collections received from API, using defaults')
        return defaultCollections
      }
      
      return validCollections
    } catch (error: any) {
      console.error('Failed to fetch collections:', error)
      
      // Return default collections on error instead of rejecting
      return defaultCollections
    }
  }
)

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error.categories = null
      state.error.collections = null
    },
    resetNavigation: () => initialState
  },
  extraReducers: (builder) => {
    // Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading.categories = true
        state.error.categories = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading.categories = false
        state.categories = action.payload
        state.lastFetched.categories = Date.now()
        state.error.categories = null
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading.categories = false
        state.error.categories = action.payload as string
        // Keep default categories on error
        if (state.categories.length === 0) {
          state.categories = defaultCategories
        }
      })
    
    // Collections
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading.collections = true
        state.error.collections = null
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading.collections = false
        state.collections = action.payload
        state.lastFetched.collections = Date.now()
        state.error.collections = null
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading.collections = false
        state.error.collections = action.payload as string
        // Keep default collections on error
        if (state.collections.length === 0) {
          state.collections = defaultCollections
        }
      })
  }
})

export const { clearErrors, resetNavigation } = navigationSlice.actions

// Selectors
export const selectCategories = (state: { navigation: NavigationState }) => state.navigation.categories
export const selectCollections = (state: { navigation: NavigationState }) => state.navigation.collections
export const selectNavigationLoading = (state: { navigation: NavigationState }) => state.navigation.loading
export const selectNavigationErrors = (state: { navigation: NavigationState }) => state.navigation.error

export default navigationSlice.reducer
