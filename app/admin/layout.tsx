import type React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Providers } from "@/components/providers/Providers";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Dashboard - ModernShop",
  description: "Admin panel for managing the e-commerce platform",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and has admin role
  if (!session) {
    redirect("/auth/signin");
  }

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex bg-gray-50 dark:bg-gray-950 w-full h-screen overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 flex-col max-h-screen overflow-y-auto">
              <AdminHeader />
              <div className="p-6">{children}</div>
            </main>
          </div>
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
