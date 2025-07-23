"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import AccountSidebar from "@/components/account/AccountSidebar"
import AccountOverview from "@/components/account/AccountOverview"

export default function AccountPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings and view your activity</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>
          <div className="lg:col-span-3">
            <AccountOverview />
          </div>
        </div>
      </div>
    </div>
  )
}
