"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type CartItem, type CartState, cartService } from "@/lib/cart"

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  updateQuantity: (id: string, size: string, firmness: string, quantity: number) => void
  removeItem: (id: string, size: string, firmness: string) => void
  clearCart: () => void
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    total: 0,
    itemCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load cart from localStorage on mount
    const items = cartService.getCart()
    const { total, itemCount } = cartService.calculateTotals(items)
    setCartState({ items, total, itemCount })
    setIsLoading(false)
  }, [])

  const updateCartState = (items: CartItem[]) => {
    const { total, itemCount } = cartService.calculateTotals(items)
    setCartState({ items, total, itemCount })
  }

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    const updatedItems = cartService.addItem(item, quantity)
    updateCartState(updatedItems)
  }

  const updateQuantity = (id: string, size: string, firmness: string, quantity: number) => {
    const updatedItems = cartService.updateQuantity(id, size, firmness, quantity)
    updateCartState(updatedItems)
  }

  const removeItem = (id: string, size: string, firmness: string) => {
    const updatedItems = cartService.removeItem(id, size, firmness)
    updateCartState(updatedItems)
  }

  const clearCart = () => {
    cartService.clearCart()
    setCartState({ items: [], total: 0, itemCount: 0 })
  }

  return (
    <CartContext.Provider
      value={{
        ...cartState,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
