import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header Skeleton */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 animate-pulse">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-md pl-10"></div>
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="hidden lg:block">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
                  </div>

                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                      <div className="space-y-2">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Filters Button */}
          <div className="lg:hidden">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full mb-6 animate-pulse"></div>
          </div>

          {/* Results Skeleton */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48"></div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-800"></div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-12"></div>
                      </div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
