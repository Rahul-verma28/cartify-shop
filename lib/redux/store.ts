import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit"
import cartSlice from "./slices/cartSlice"
import wishlistSlice from "./slices/wishlistSlice"
import uiSlice from "./slices/uiSlice"
import productsSlice from "./slices/productsSlice"
import adminProductsSlice from "./slices/adminProductsSlice"
import filtersSlice from "./slices/filtersSlice"
import navigationReducer from './slices/navigationSlice'

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "wishlist"],
}

const rootReducer = combineReducers({
  cart: cartSlice,
  wishlist: wishlistSlice,
  ui: uiSlice,
  products: productsSlice,
  adminProducts: adminProductsSlice,
  filters: filtersSlice,
  navigation: navigationReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
