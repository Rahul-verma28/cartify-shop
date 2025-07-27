"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-950 w-full h-screen overflow-hidden">
      <AdminSidebar mobileOpen={mobileOpen} onMobileToggle={toggleMobile} />
      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto md:ml-0">
        <AdminHeader onMobileMenuToggle={toggleMobile} />
        <div className="p-4 md:p-6 flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
