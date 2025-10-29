"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { authService } from "@/lib/auth"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BookOpen,
  Settings,
  Star,
  UserCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "All Users" },
  { href: "/admin/leads", icon: UserCheck, label: "Leads" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/blogs", icon: BookOpen, label: "Blogs" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || !authService.isAdmin(user))) {
      router.push("/")
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

  if (!user || !authService.isAdmin(user)) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div 
        className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-40
        md:static md:translate-x-0 md:h-auto md:w-auto
        fixed left-0 top-0 h-full w-64
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isSidebarOpen ? 'md:w-64' : 'md:w-16'}`}
        onMouseEnter={() => { if (window.innerWidth >= 768) setIsSidebarOpen(true) }}
        onMouseLeave={() => { if (window.innerWidth >= 768) setIsSidebarOpen(false) }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">NR</span>
            </div>
            {isSidebarOpen && (
              <div className="transition-opacity duration-300">
                <h2 className="font-bold text-slate-900 text-lg">Nexa Rest</h2>
                <p className="text-sm text-slate-600">Admin Panel</p>
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

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200">
          <div className={`flex items-center gap-3 mb-3 ${!isSidebarOpen ? "justify-center" : ""}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            {isSidebarOpen && (
            <div className="flex-1 min-w-0 transition-opacity duration-300">
              <p className="text-base font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-sm text-slate-600 truncate">{user.email}</p>
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
              {isSidebarOpen ? "Store" : "🏪"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout} 
              className={`${isSidebarOpen ? 'flex-1 text-base' : 'w-8 h-8 p-0'} bg-transparent transition-all duration-300`}
              title={!isSidebarOpen ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <div className="md:hidden sticky top-0 z-20 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between p-3">
            <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="font-semibold">Admin</div>
            <div className="w-9" />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
