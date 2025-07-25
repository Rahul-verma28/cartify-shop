import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  theme: "light" | "dark"
  cartDrawerOpen: boolean
  mobileMenuOpen: boolean
  searchQuery: string
}

const initialState: UIState = {
  theme: "light",
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  searchQuery: "",
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload
    },
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen
    },
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.cartDrawerOpen = action.payload
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
})

export const { setTheme, toggleCartDrawer, setCartDrawerOpen, toggleMobileMenu, setSearchQuery } = uiSlice.actions
export default uiSlice.reducer
