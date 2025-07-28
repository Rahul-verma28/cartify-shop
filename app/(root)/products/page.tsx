import { Suspense } from "react";
import ProductsGrid from "@/components/products/ProductsGrid";
import ProductFilters from "@/components/products/ProductFilters";
import ProductsLoading from "@/components/products/ProductsLoading";

export const metadata = {
  title: "Products - ModernShop",
  description: "Browse our extensive collection of premium products",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <Suspense fallback={<ProductsLoading />}>
              <ProductsGrid />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
