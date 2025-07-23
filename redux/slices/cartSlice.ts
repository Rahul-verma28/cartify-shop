import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "@/types"

interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.items.find((item) => item.product?._id === product?._id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({ product, quantity })
      }

      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
      state.total = state.items.reduce((total, item) => total + item.product?.price * item.quantity, 0)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product?._id !== action.payload)
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
      state.total = state.items.reduce((total, item) => total + item.product?.price * item.quantity, 0)
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload
      const item = state.items.find((item) => item.product?._id === productId)

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.product?._id !== productId)
        } else {
          item.quantity = quantity
        }
      }

      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
      state.total = state.items.reduce((total, item) => total + item.product?.price * item.quantity, 0)
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
