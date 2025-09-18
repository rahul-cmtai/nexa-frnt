"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { type WishlistItem, type WishlistState, wishlistService } from "@/lib/wishlist"

interface WishlistContextType extends WishlistState {
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  clear: () => void
  isLoading: boolean
  isInWishlist: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WishlistState>({ items: [], itemCount: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const items = wishlistService.getWishlist()
    setState({ items, itemCount: items.length })
    setIsLoading(false)
  }, [])

  const updateState = (items: WishlistItem[]) => {
    setState({ items, itemCount: items.length })
  }

  const addItem = (item: WishlistItem) => {
    const updated = wishlistService.addItem(item)
    updateState(updated)
  }

  const removeItem = (id: string) => {
    const updated = wishlistService.removeItem(id)
    updateState(updated)
  }

  const clear = () => {
    wishlistService.clear()
    setState({ items: [], itemCount: 0 })
  }

  const isInWishlist = useMemo(() => {
    const ids = new Set(state.items.map((i) => i.id))
    return (id: string) => ids.has(id)
  }, [state.items])

  return (
    <WishlistContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        clear,
        isLoading,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}


