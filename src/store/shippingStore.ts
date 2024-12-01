import { Product } from '@prisma/client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// TODO PUT TO PRISMA and call it as here
// interface CartItem extends Product {
//   qty: number
// }

interface ShippingInfo {
  name: string
  address: string
  city: string
  zip: string
  country: string
  phone: string
  note: string
  is_billing_address: string
  billing_name: string
  billing_address: string
  billing_city: string
  billing_zip: string
  billing_country: string
  billing_ico: string
  billing_dic: string
  billing_ico_dph: string
  is_ico_dic: string
}

interface ShippingState {
  info: ShippingInfo[]
  //addToCart: (product: Product, qty: number) => void
  //updateItemQty: (productId: string, qty: number) => void
  //removeFromCart: (productId: string) => void
}

const useShippingStore = create<ShippingState>()(
  persist(
    (set, get) => ({
      info: [],
    }),
    {
      name: 'shipping-info',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export default useShippingStore
