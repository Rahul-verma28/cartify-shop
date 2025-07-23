"use client"

import { motion } from "framer-motion"
import { Truck, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminShippingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shipping Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure shipping methods and rates for your store.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Shipping Zones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              This section will allow you to define shipping zones, set up different shipping methods (e.g., flat rate,
              free shipping, calculated rates), and manage shipping costs based on location, weight, or order total.
            </p>
            <p className="text-muted-foreground">*This feature is under development. Check back soon for updates!*</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              General Shipping Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Here you will be able to set default shipping options, integrate with shipping carriers, and manage
              fulfillment settings.
            </p>
            <p className="text-muted-foreground">*This feature is under development. Check back soon for updates!*</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
