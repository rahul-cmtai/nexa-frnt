"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

export function RegisterDialogButton({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    try {
      const baseRaw = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const base = baseRaw.replace(/\/+$/, "")
      const apiRoot = base.replace(/\/(api)(?:\/v\d+)?$/, "")
      const urlPrimary = `${apiRoot}/api/v1/auth/register`
      const doRequest = async (url: string) => {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
        })
        const contentType = res.headers.get("content-type") || ""
        const isJson = contentType.includes("application/json")
        const data = isJson ? await res.json().catch(() => ({})) : ({} as any)
        return { res, data, isJson }
      }

      let { res, data, isJson } = await doRequest(urlPrimary)

      if ((!res.ok && res.status === 404) || (!isJson && !res.ok)) {
        const urlAlt = `${base}/api/v1/auth/register`
        ;({ res, data, isJson } = await doRequest(urlAlt))
      }

      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || `Registration failed (${res.status})`
        throw new Error(msg)
      }

      const newUser = (data as any)?.user || (data as any)?.data?.user
      const token = (data as any)?.token || (data as any)?.data?.token

      if (token) localStorage.setItem("nexa_rest_token", token)
      if (newUser) {
        localStorage.setItem("nexa_rest_current_user", JSON.stringify(newUser))
        window.dispatchEvent(new Event("auth:changed"))
      }

      setOpen(false)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span>{children}</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input id="name" name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleChange} className="pl-10" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="pl-10" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={formData.password} onChange={handleChange} className="pl-10 pr-10" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className="pl-10" required />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


