"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, User, Heart, Search, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { RegisterDialogButton } from "@/components/auth/register-dialog"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const { itemCount } = useCart()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Mattresses", href: "/products" },
    { name: "Pillows", href: "/pillows" },
    { name: "Protectors", href: "/protectors" },
    { name: "Accessories", href: "/accessories" },
    { name: "About", href: "/about" },
    { name: "Sleep Guide", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]

  const handleLogout = async () => {
    try {
      // Clear local storage token if present
      if (typeof window !== "undefined") {
        localStorage.removeItem("nexa_rest_token")
        localStorage.removeItem("nexa_rest_current_user")
      }
      await logout()
      router.push("/")
    } catch {}
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg font-playfair">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-playfair font-bold text-lg leading-none">Nexa Rest</span>
              <span className="text-xs text-muted-foreground leading-none">Next Level of Sleep</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => router.push("/wishlist")} title="Wishlist">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/cart")} title="Cart">
              <ShoppingCart className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">{itemCount}</Badge>
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/dashboard")}
                  title={`Welcome, ${user.name}`}
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.push("/login")}> 
                  <User className="h-4 w-4" />
                </Button>
                <RegisterDialogButton>
                  <Button className="hidden md:inline-flex">Sign Up</Button>
                </RegisterDialogButton>
              </div>
            )}

            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/wishlist")
                        setIsOpen(false)
                      }}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/cart")
                        setIsOpen(false)
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                    </Button>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            router.push("/dashboard")
                            setIsOpen(false)
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            handleLogout()
                            setIsOpen(false)
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            router.push("/login")
                            setIsOpen(false)
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                        <RegisterDialogButton>
                          <Button className="w-full" onClick={() => setIsOpen(false)}>Sign Up</Button>
                        </RegisterDialogButton>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
