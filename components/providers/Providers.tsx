"use client"

import type React from "react"

import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { store, persistor } from "@/redux/store"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  )
}
