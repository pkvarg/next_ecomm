import { create } from 'zustand'

// Define the Zustand store
export const cartStore = create((set) => ({
  cart: {
    items_count: 0,
    items: [], // Array to hold the items
  },

  updateCart: (newItem: any) =>
    set((state: any) => ({
      cart: {
        ...state.cart,
        items_count: state.cart.items_count + 1, // Increment the item count
        items: [...state.cart.items, newItem], // Add the new item to the items array
      },
    })),
}))
