import { Product } from '@prisma/client'
import { create } from 'zustand'

interface CartItem extends Product {
  qty: number
}

interface CartState {
  items: CartItem[]
  addToCart: (product: Product) => void
}

// const useCartStore = create<CartState>((set, get) => ({
//   items: [],
//   addToCart: (product) =>
//     set({
//       items: [...get().items],
//     }),
// }))

const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product) => {
    const { items } = get()

    // Check if product already exists in the cart
    const existingItemIndex = items.findIndex((item) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // If the product exists, increment its quantity
      const updatedItems = [...items]
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        qty: updatedItems[existingItemIndex].qty + 1,
      }

      set({ items: updatedItems })
    } else {
      // If the product does not exist, add it with qty: 1
      set({
        items: [...items, { ...product, qty: 1 }],
      })
    }
  },
}))

export default useCartStore
