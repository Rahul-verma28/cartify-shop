import { Suspense } from "react"
import Header from "@/components/layout/Header"
import HeroSection from "@/components/sections/HeroSection"
import FeaturedProducts from "@/components/sections/FeaturedProducts"
import CategoryGrid from "@/components/sections/CategoryGrid"
import Footer from "@/components/layout/Footer"
import CartDrawer from "@/components/cart/CartDrawer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={<div>Loading featured products?...</div>}>
          <FeaturedProducts />
        </Suspense>
        <CategoryGrid />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
