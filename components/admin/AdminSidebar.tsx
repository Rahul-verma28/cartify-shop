"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HomeIcon,
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  TagIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline"
import { motion } from "framer-motion"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Products", href: "/admin/products", icon: CubeIcon },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBagIcon },
  { name: "Users", href: "/admin/users", icon: UsersIcon },
  { name: "Categories", href: "/admin/categories", icon: TagIcon },
  { name: "Collections", href: "/admin/collections", icon: RectangleStackIcon },
  { name: "Reviews", href: "/admin/reviews", icon: ChatBubbleLeftRightIcon },
  { name: "Shipping", href: "/admin/shipping", icon: TruckIcon },
  { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  { name: "Settings", href: "/admin/settings", icon: CogIcon },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-white dark:bg-gray-900 shadow-sm border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}
    >
      <div className="p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <svg
            className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </motion.aside>
  )
}
