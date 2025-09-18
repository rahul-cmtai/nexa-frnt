"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { API_CONFIG } from "@/lib/config"

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role?: "user" | "admin"
  dateOfBirth?: string
  gender?: string
  bio?: string
  address?: {
    street: string
    city: string
    state: string
    pincode: string
    country?: string
  }
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const CURRENT_USER_KEY = "nexa_rest_current_user"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Hydrate user from localStorage and listen for auth change events
  useEffect(() => {
    const hydrate = () => {
      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem(CURRENT_USER_KEY) : null
        setUser(raw ? (JSON.parse(raw) as User) : null)
      } catch {
        setUser(null)
      }
    }

    hydrate()
    const onChanged = () => hydrate()
    if (typeof window !== "undefined") {
      window.addEventListener("auth:changed", onChanged as EventListener)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:changed", onChanged as EventListener)
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Try external API first, then fallback to local API
      const externalApiUrl = API_CONFIG.EXTERNAL_API_URL
      const localApiUrl = API_CONFIG.LOCAL_API_URL
      
      const makeRequest = async (url: string) => {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json", 
              Accept: "application/json" 
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
          })
          
          const data = await res.json().catch(() => ({}))
          return { res, data, error: null }
        } catch (error) {
          console.log(`Request to ${url} failed:`, error)
          return { res: null, data: {}, error: error instanceof Error ? error.message : 'Network error' }
        }
      }
      
      let { res, data, error } = await makeRequest(externalApiUrl)
      
      // If external API fails (CORS, network error, 404, etc.), try local API
      if (error || !res || !res.ok || res.status === 0 || res.status === 404 || res.status >= 500) {
        console.log("External API failed, trying local API...", error || `Status: ${res?.status}`)
        ;({ res, data, error } = await makeRequest(localApiUrl))
      }
      
      if (error || !res || !res.ok) {
        const errorMsg = error || data?.message || data?.error || `Login failed (${res?.status || 'Network Error'})`
        setIsLoading(false)
        return { error: errorMsg }
      }
      
      const loggedInUser = data?.user || data?.data?.user
      const token = data?.token || data?.data?.token
      const accessToken = data?.accessToken || data?.data?.accessToken || token
      
      if (accessToken) {
        try {
          localStorage.setItem("nexa_rest_token", accessToken)
          localStorage.setItem("accessToken", accessToken)
        } catch {}
      }
      
      if (loggedInUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser))
        setUser(loggedInUser)
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:changed"))
        }
      }
      
      setIsLoading(false)
      return {}
    } catch (error: any) {
      setIsLoading(false)
      return { error: error.message || "Login failed" }
    }
  }

  const logout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(CURRENT_USER_KEY)
      }
    } finally {
      setUser(null)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:changed"))
      }
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData }
      setUser(updated)
      if (typeof window !== "undefined") {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated))
        window.dispatchEvent(new Event("auth:changed"))
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
