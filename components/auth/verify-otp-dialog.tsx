"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VerifyOtpDialogProps {
  open: boolean
  email: string
  onClose: () => void
  onVerified?: () => void
}

export function VerifyOtpDialog({ open, email, onClose, onVerified }: VerifyOtpDialogProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!open) {
      setOtp("")
      setError("")
      setSuccess("")
    }
  }, [open])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const baseRaw = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const base = baseRaw.replace(/\/+$/, "")
      const apiRoot = base.replace(/\/(api)(?:\/v\d+)?$/, "")
      const url = `${apiRoot}/api/v1/auth/verify-otp`
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || `Verification failed (${res.status})`
        throw new Error(msg)
      }
      setSuccess("Email verified. You can now sign in.")
      onVerified?.()
      setTimeout(() => onClose(), 800)
    } catch (err: any) {
      setError(err.message || "Verification failed")
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify your email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleVerify} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input id="otp" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


