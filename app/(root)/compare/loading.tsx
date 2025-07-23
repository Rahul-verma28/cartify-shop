import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Scale } from "lucide-react"

export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Scale className="h-8 w-8 mr-3 text-gray-400" />
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48"></div>
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
          </div>
        </div>

        {/* Comparison Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </div>
                ))}
              </div>

              {/* Feature rows skeleton */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 py-4 border-b animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
