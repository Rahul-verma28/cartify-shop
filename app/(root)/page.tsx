import { Suspense } from "react";
// import HeroSection from "@/components/sections/HeroSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import CategoryGrid from "@/components/sections/CategoryGrid";
import Home from "@/components/sections/Home";

export default function HomePage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <Home/>
      {/* <HeroSection /> */}
      <Suspense fallback={<div>Loading featured products?...</div>}>
        <FeaturedProducts />
      </Suspense>
      <CategoryGrid />
    </div>
  );
}
