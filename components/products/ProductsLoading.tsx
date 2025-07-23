export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-300 dark:bg-gray-800 aspect-square rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-2/3 mb-2"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-800 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )
}
