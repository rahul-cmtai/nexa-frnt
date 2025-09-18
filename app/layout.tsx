import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { Suspense } from "react"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nexa Rest - Next Level of Sleep | Premium Mattresses",
  description:
    "Experience the next level of sleep with Nexa Rest premium mattresses. 100-night trial, 10-year warranty, free delivery. Shop luxury mattresses online.",
  keywords:
    "premium mattresses, luxury sleep, memory foam, hybrid mattresses, sleep quality, Nexa Rest, Babji Mattress House",
  authors: [{ name: "Nexa Rest" }],
  creator: "Nexa Rest",
  publisher: "Nexa Rest",
  openGraph: {
    title: "Nexa Rest - Next Level of Sleep",
    description: "Premium mattresses for the ultimate sleep experience",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexa Rest - Next Level of Sleep",
    description: "Premium mattresses for the ultimate sleep experience",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${playfairDisplay.variable} ${sourceSans.variable} antialiased`}>
        <Suspense>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>{children}</WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
