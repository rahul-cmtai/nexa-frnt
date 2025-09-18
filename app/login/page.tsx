"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { API_CONFIG } from "@/lib/config"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showVerify, setShowVerify] = useState(false)

  // Handle redirect after successful login
  useEffect(() => {
    if (user) {
      if (user === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
    console.log("user", user)
    console.log("admin", user?.role === "admin")
    console.log("dashboard", user?.role === "user")
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const contentType = res.headers.get("content-type") || ""
      const isJson = contentType.includes("application/json")
      const data = isJson ? await res.json().catch(() => ({})) : ({} as any)

      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || `Login failed (${res.status || 'Network Error'})`
        // If 403 and message contains "verify", show OTP dialog
        if (res.status === 403 && msg.toLowerCase().includes("verify")) {
          setError(msg)
          setShowVerify(true)
          setIsLoading(false)
          return
        }
        throw new Error(msg)
      }

      const loggedInUser = (data as any)?.user || (data as any)?.data?.user
      if (loggedInUser) {
        localStorage.setItem("nexa_rest_current_user", JSON.stringify(loggedInUser))
        setUser(loggedInUser.role)
        window.dispatchEvent(new Event("auth:changed"))
      }

      console.log("Login successful, redirecting...")
    } catch (err: any) {
      setError(err.message || "Invalid email or password")
    }

    setIsLoading(false)
  }

  const handleVerifyOtp = async (otp: string) => {
    setError("")
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed")
      }
      // OTP verified, now login again or redirect
      setShowVerify(false)
      router.push("/login") // or auto-login
    } catch (err: any) {
      setError(err.message || "OTP verification failed")
    }
    setIsLoading(false)
  }

  type OtpDialogProps = {
    open: boolean
    email: string
    onClose: () => void
    onVerify: (otp: string) => Promise<void>
  }

  function OtpDialog({ open, email, onClose, onVerify }: OtpDialogProps) {
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleVerify = async () => {
      setLoading(true)
      setError("")
      try {
        await onVerify(otp)
        setOtp("")
      } catch (err: any) {
        setError(err.message || "OTP verification failed")
      }
      setLoading(false)
    }

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
            />
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <Button onClick={handleVerify} disabled={loading || !otp} className="w-full">
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Nexa Rest account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Don't have an account? </span>
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
      <OtpDialog
        open={showVerify}
        email={email}
        onClose={() => setShowVerify(false)}
        onVerify={handleVerifyOtp}
      />
    </div>
  )
}
