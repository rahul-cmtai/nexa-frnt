"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Mail, Calendar, MoreHorizontal } from "lucide-react"

// Defines the shape of a user object for the frontend
type AdminUser = {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: string
  status?: string
  joinDate?: string
  totalOrders?: number // These fields might not be in the default user model
  totalSpent?: number   // The UI will handle them gracefully if they are missing
}

// Custom hook for debouncing a value
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [totalUserCount, setTotalUserCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    let isMounted = true

    const fetchUsers = async () => {
      try {
        if (!isMounted) return
        setIsLoading(true)
        setError(null)

        const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000").replace(/\/+$/, "")
        const token = localStorage.getItem("accessToken")

        // Construct URL with search query parameter if it exists
        const url = new URL(`${API_BASE}/api/v1/admin/users`)
        if (debouncedSearchTerm) {
          url.searchParams.append("search", debouncedSearchTerm)
        }
        
        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        })

        const json = await res.json()

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to fetch users.")
        }

        // Correctly access the user data from the API response structure
        const userData = json.data?.users || []
        const totalCount = json.data?.totalUsers || 0

        // Normalize backend data fields (e.g., fullName) to frontend fields (e.g., name)
        const normalizedUsers = userData.map((u: any) => ({
          id: u._id,
          name: u.fullName, // Map fullName to name
          email: u.email,
          phone: u.phone,
          role: u.role,
          status: u.status,
          joinDate: u.createdAt, // Map createdAt to joinDate
          totalOrders: u.totalOrders ?? 0,
          totalSpent: u.totalSpent ?? 0,
        }))

        if (isMounted) {
          setUsers(normalizedUsers)
          setTotalUserCount(totalCount)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "An unexpected error occurred.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchUsers()

    return () => {
      isMounted = false
    }
  }, [debouncedSearchTerm]) // Re-fetch whenever the debounced search term changes

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">User Management</h1>
        <p className="text-lg text-slate-600">Manage all registered users and their activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">{totalUserCount}</p>
              </div>
              <Users className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        {/* Note: The following stats are calculated client-side from the current page of users. */}
        {/* For full accuracy, these should be separate API endpoints. */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-slate-600">Active Users</p>
                <p className="text-3xl font-bold text-slate-900">{users.filter((u) => u.status?.toLowerCase() === "active").length}</p>
              </div>
              <Users className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-slate-600">Admin Users</p>
                <p className="text-3xl font-bold text-slate-900">{users.filter((u) => u.role?.toLowerCase() === "admin").length}</p>
              </div>
              <Users className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading
              ? "Loading users..."
              : error
              ? `Error: ${error}`
              : `All Users (${totalUserCount})`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-700">User</th>
                  <th className="text-left p-4 font-medium text-slate-700">Role</th>
                  <th className="text-left p-4 font-medium text-slate-700">Status</th>
                  <th className="text-left p-4 font-medium text-slate-700">Orders</th>
                  <th className="text-left p-4 font-medium text-slate-700">Total Spent</th>
                  <th className="text-left p-4 font-medium text-slate-700">Join Date</th>
                  <th className="text-left p-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && !error && users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {(user.name || user.email || "?").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.name || "Unnamed"}</p>
                          <p className="text-sm text-slate-600">{user.email || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={user.role?.toLowerCase() === "admin" ? "default" : "secondary"}>
                        {user.role || "-"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={user.status?.toLowerCase() === "active" ? "default" : "secondary"}>
                        {user.status || "-"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{user.totalOrders ?? 0}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{formatPrice(user.totalSpent ?? 0)}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-3 w-3" />
                        {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "-"}
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}