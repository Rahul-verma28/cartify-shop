"use client"

import { motion } from "framer-motion"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Gain insights into your store's performance.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Sales Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              This section will provide detailed charts and graphs on your sales performance over time, including
              revenue, order count, and average order value.
            </p>
            <p className="text-muted-foreground">*This feature is under development. Check back soon for updates!*</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2" />
              Customer Behavior
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Track customer acquisition, retention, and engagement metrics. Understand popular products and customer
              segments.
            </p>
            <p className="text-muted-foreground">*This feature is under development. Check back soon for updates!*</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Product Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Analyze which products are performing best, identify slow-moving inventory, and optimize your product
              offerings.
            </p>
            <p className="text-muted-foreground">*This feature is under development. Check back soon for updates!*</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
