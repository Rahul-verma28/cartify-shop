"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
  Tags,
  Truck,
  MessageSquare,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Collections", href: "/admin/collections", icon: Library },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Shipping", href: "/admin/shipping", icon: Truck },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export default function AdminSidebar({
  mobileOpen = false,
  onMobileToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const closeMobile = () => {
    if (isMobile && onMobileToggle) {
      onMobileToggle();
    }
  };

  // Mobile Sheet Component
  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Sheet */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 bg-background border-r shadow-xl z-50 flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-3">
                  {/* <span className="text-primary-foreground font-bold text-lg w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    M
                  </span>
                  <h2 className="text-lg font-semibold tracking-tight">
                    CartifyShop
                  </h2> */}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobile}
                  className="touch-manipulation"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 px-4 py-4 overflow-y-auto">
                <ul className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={closeMobile}
                          className={cn(
                            "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors touch-manipulation",
                            isActive
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="ml-3">{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Sidebar
  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className={cn(
        "bg-background border-r transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && (
          <div className="flex items-center justify-center gap-3">
            <span className="text-primary-foreground font-bold text-lg w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              M
            </span>
            <h2 className="text-lg font-semibold tracking-tight">
              CartifyShop
            </h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5 flex-shrink-0" />
          ) : (
            <PanelLeftClose className="h-5 w-5 flex-shrink-0" />
          )}
        </Button>
      </div>

      <nav className="flex-1 px-4 py-4">
        <TooltipProvider delayDuration={0}>
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          isActive
                            ? "bg-muted text-primary"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                          collapsed && "justify-center"
                        )}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && (
                          <span className="ml-3">{item.name}</span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>
    </motion.aside>
  );
}
