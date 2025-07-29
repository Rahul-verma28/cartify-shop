"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { User, ShoppingBag, Heart, Settings, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const navigation = [
  { name: "Overview", href: "/account", icon: User },
  { name: "Orders", href: "/", icon: ShoppingBag },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Settings", href: "/", icon: Settings },
]

export default function AccountSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <Card>
      <CardHeader>
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
            <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{session?.user?.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{session?.user?.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button key={item.name} asChild variant={isActive ? "default" : "ghost"} className="w-full justify-start">
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              </Button>
            )
          })}

          <Separator className="my-4" />

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </nav>
      </CardContent>
    </Card>
  )
}
