import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-bold text-lg font-playfair">N</span>
              </div>
              <div className="flex flex-col">
                <span className="font-playfair font-bold text-lg leading-none">Nexa Rest</span>
                <span className="text-xs text-background/70 leading-none">Next Level of Sleep</span>
              </div>
            </div>
            <p className="text-background/80 text-sm text-pretty">
              Experience the next level of sleep with our premium mattresses. Designed for comfort, built for life.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-background hover:text-secondary">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-secondary">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-secondary">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-secondary">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-background/80 hover:text-secondary transition-colors">
                  All Mattresses
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-background/80 hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-background/80 hover:text-secondary transition-colors">
                  Sleep Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-background/80 hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-background/80 hover:text-secondary transition-colors">
                  Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" className="text-background/80 hover:text-secondary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-background/80 hover:text-secondary transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-background/80 hover:text-secondary transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-background/80 hover:text-secondary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-background/80 hover:text-secondary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Connected</h3>
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-secondary" />
                  <span className="text-background/80">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-secondary" />
                  <span className="text-background/80">hello@nexarest.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-secondary" />
                  <span className="text-background/80">Mumbai, India</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-background/80 mb-2">Subscribe for sleep tips & offers</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter your email"
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                  />
                  <Button variant="secondary" size="sm">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-background/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-background/60">
              © 2024 Nexa Rest / Babji Mattress House. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-background/60 hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-background/60 hover:text-secondary transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/cookies" className="text-background/60 hover:text-secondary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
