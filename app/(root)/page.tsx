import { Suspense } from "react";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import CategoryGrid from "@/components/sections/CategoryGrid";
import Home from "@/components/sections/Home";
import Collections from "@/components/Collections";
import BrandShowcase from "@/components/sections/BrandShowcase";

export default function HomePage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <Home />
      <Collections />
      <Suspense fallback={<div>Loading featured products?...</div>}>
        <FeaturedProducts />
      </Suspense>
      <CategoryGrid />
      <BrandShowcase />
    </div>
  );
}
