//import { Product } from '@prisma/client'
import { Product } from '@/../../types/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface CartItem extends Product {
  qty: number
}

interface CartState {
  items: CartItem[]
  addToCart: (product: Product, qty: number) => void
  updateItemQty: (productId: string, qty: number) => void
  removeFromCart: (productId: string) => void
  resetCart: () => void
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, qty) => {
        const { items } = get()

        // Check if the product already exists in the cart
        const existingItemIndex = items.findIndex((item) => item.id === product.id)

        if (existingItemIndex >= 0) {
          // If the product exists, update its quantity by the given qty
          const updatedItems = [...items]
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            qty: updatedItems[existingItemIndex].qty + qty,
          }

          set({ items: updatedItems })
        } else {
          // If the product does not exist, add it with the provided qty
          set({
            items: [...items, { ...product, qty }],
          })
        }
      },

      // Optional: A function to update the quantity of a specific item
      updateItemQty: (productId: string, qty: number) => {
        const { items } = get()
        const updatedItems = items.map((item) => (item.id === productId ? { ...item, qty } : item))

        set({ items: updatedItems })
      },
      // Function to remove an item from the cart by its product ID
      removeFromCart: (productId: string) => {
        const { items } = get()
        const updatedItems = items.filter((item) => item.id !== productId)

        set({ items: updatedItems })
      },
      resetCart: () => {
        set({ items: [] }) // Reset Zustand state
        sessionStorage.removeItem('cart-storage') // Clear persisted data
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export default useCartStore
