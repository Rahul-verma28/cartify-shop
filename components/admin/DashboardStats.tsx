"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline"

interface Stat {
  name: string
  value: string
  change: string
  changeType: "increase" | "decrease"
  icon: React.ComponentType<any>
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const defaultStats: Stat[] = [
    {
      name: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "increase",
      icon: CurrencyDollarIcon,
    },
    {
      name: "Orders",
      value: "2,350",
      change: "+180.1%",
      changeType: "increase",
      icon: ShoppingBagIcon,
    },
    {
      name: "Customers",
      value: "1,234",
      change: "+19%",
      changeType: "increase",
      icon: UsersIcon,
    },
    {
      name: "Products",
      value: "573",
      change: "+5.2%",
      changeType: "increase",
      icon: CubeIcon,
    },
  ]

  const displayStats = stats?.length > 0 ? stats : defaultStats

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {stat.changeType === "increase" ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ml-1 ${
                stat.changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.change}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">from last month</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
