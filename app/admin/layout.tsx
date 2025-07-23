import type React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Admin Dashboard - ModernShop",
  description: "Admin panel for managing the e-commerce platform",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 flex-col overflow-y-auto">
          <AdminHeader />
          <div className="p-6">{children}</div>
        </main>
    </div>
  );
}
