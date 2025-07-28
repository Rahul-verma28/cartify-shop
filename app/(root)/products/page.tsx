import { Suspense } from "react";
import ProductsGrid from "@/components/products/ProductsGrid";
import ProductFilters from "@/components/products/ProductFilters";
import ProductsLoading from "@/components/products/ProductsLoading";
import Link from "next/link";

export const metadata = {
  title: "Products - ModernShop",
  description: "Browse our extensive collection of premium products",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <div
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white truncate">
              Products
            </span>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
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
