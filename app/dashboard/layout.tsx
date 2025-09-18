"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Heart,
  User,
  MapPin,
  Settings,
  ShoppingBag,
  LogOut,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/orders", icon: Package, label: "My Orders" },
  { href: "/dashboard/cart", icon: ShoppingBag, label: "My Cart" },
  { href: "/dashboard/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/addresses", icon: MapPin, label: "Addresses" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div 
        className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">NR</span>
            </div>
            {isSidebarOpen && (
              <div className="transition-opacity duration-300">
                <h2 className="font-bold text-slate-900 text-lg">Nexa Rest</h2>
                <p className="text-sm text-slate-600">My Account</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors group ${
                      isActive ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-700 hover:bg-slate-100"
                    } ${!isSidebarOpen ? "justify-center" : ""}`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {isSidebarOpen && (
                      <span className="transition-opacity duration-300 whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-slate-200">
          <div className={`flex items-center gap-3 mb-3 ${!isSidebarOpen ? "justify-center" : ""}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            {isSidebarOpen && (
            <div className="flex-1 min-w-0 transition-opacity duration-300">
              <p className="text-base font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-sm text-slate-600 truncate">{user?.email}</p>
            </div>
            )}
          </div>
          <div className={`flex gap-2 ${!isSidebarOpen ? "justify-center" : ""}`}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push("/")} 
              className={`${isSidebarOpen ? 'flex-1 text-base' : 'w-8 h-8 p-0'} transition-all duration-300`}
              title={!isSidebarOpen ? "Store" : undefined}
            >
              {isSidebarOpen ? "Store" : <Home className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push("/cart")} 
              className={`${isSidebarOpen ? 'flex-1 text-base' : 'w-8 h-8 p-0'} transition-all duration-300`}
              title={!isSidebarOpen ? "Cart" : undefined}
            >
              {isSidebarOpen ? "Cart" : <ShoppingBag className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout} 
              className={`${isSidebarOpen ? 'flex-1 text-base' : 'w-8 h-8 p-0'} bg-transparent transition-all duration-300`}
              title={!isSidebarOpen ? "Logout" : undefined}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}
