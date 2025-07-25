"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart, LineChart, PieChart, Calendar, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminAnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30days")

  // Placeholder animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Gain insights into your store's performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Total Revenue", value: "$12,345", change: "+12.3%", icon: ArrowUpRight },
              { title: "Orders", value: "432", change: "+8.2%", icon: ArrowUpRight },
              { title: "Customers", value: "218", change: "+5.1%", icon: ArrowUpRight },
              { title: "Avg. Order Value", value: "$94.32", change: "+2.5%", icon: ArrowUpRight }
            ].map((stat, i) => (
              <motion.div
                key={stat.title}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>{stat.title}</CardDescription>
                    <CardTitle className="text-2xl">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <p className="text-sm text-green-600 flex items-center">
                      <stat.icon className="h-4 w-4 mr-1" />
                      {stat.change} from previous period
                    </p>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              custom={4}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Sales Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                    <p className="text-muted-foreground text-center">
                      Sales chart visualization<br />
                      (Coming soon)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2" />
                    Customer Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                    <p className="text-muted-foreground text-center">
                      Customer growth visualization<br />
                      (Coming soon)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Product Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-60 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                    <p className="text-muted-foreground text-center">
                      Product category distribution<br />
                      (Coming soon)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Top Performing Products</h3>
                    <div className="space-y-3">
                      {["Premium Wireless Headphones", "Organic Cotton T-Shirt", "Smart Watch Pro", "Leather Wallet"].map((product, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <span>{product}</span>
                          <span className="text-green-600 font-medium">${(Math.random() * 100 + 50).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Other tabs would be populated with similar content */}
        <TabsContent value="sales" className="py-4">
          <div className="h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
            <p className="text-muted-foreground">Detailed sales analytics will be available soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="py-4">
          <div className="h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
            <p className="text-muted-foreground">Detailed customer analytics will be available soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="py-4">
          <div className="h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
            <p className="text-muted-foreground">Detailed product analytics will be available soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
