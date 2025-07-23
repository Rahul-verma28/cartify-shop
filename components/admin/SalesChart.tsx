"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type ChartData = { month: string; sales: number }

export default function SalesChart() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate chart data
    const mockData = [
      { month: "Jan", sales: 4000 },
      { month: "Feb", sales: 3000 },
      { month: "Mar", sales: 5000 },
      { month: "Apr", sales: 4500 },
      { month: "May", sales: 6000 },
      { month: "Jun", sales: 5500 },
    ]
    setChartData(mockData)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Overview</h3>
      <div className="h-64 flex items-end justify-between space-x-2">
        {chartData.map((data: any, index) => (
          <div key={data.month} className="flex flex-col items-center flex-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(data.sales / 6000) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary-600 w-full rounded-t-md min-h-[20px]"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-2">{data.month}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
