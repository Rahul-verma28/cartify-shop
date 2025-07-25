"use client";

import { useState } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
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

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
            <h2 className="text-lg font-semibold tracking-tight">ModernShop</h2>
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
