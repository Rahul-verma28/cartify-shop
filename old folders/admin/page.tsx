import DashboardStats from "@/components/admin/DashboardStats"
import RecentOrders from "@/components/admin/RecentOrders"
import SalesChart from "@/components/admin/SalesChart"
import TopProducts from "@/components/admin/TopProducts"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your store.</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <TopProducts />
      </div>

      <RecentOrders />
    </div>
  )
}
