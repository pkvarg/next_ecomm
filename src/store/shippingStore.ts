import { Product } from '@prisma/client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// TODO PUT TO PRISMA and call it as here

interface ShippingInfo {
  name: string
  address: string
  city: string
  zip: string
  country: string
  phone: string
  note: string
  is_billing_address: boolean
  billing_name: string
  billing_address: string
  billing_city: string
  billing_zip: string
  billing_country: string
  billing_ico: string
  billing_dic: string
  billing_ico_dph: string
  is_ico_dic: boolean
}

// Define the Zustand store's state and actions
interface ShippingStore {
  shippingInfo: ShippingInfo
  setShippingInfo: (newInfo: Partial<ShippingInfo>) => void
  resetShippingInfo: () => void
}

// Create the Zustand store with persistence
const useShippingStore = create<ShippingStore>()(
  persist(
    (set) => ({
      shippingInfo: {
        name: '',
        address: '',
        city: '',
        zip: '',
        country: '',
        phone: '',
        note: '',
        is_billing_address: false,
        billing_name: '',
        billing_address: '',
        billing_city: '',
        billing_zip: '',
        billing_country: '',
        billing_ico: '',
        billing_dic: '',
        billing_ico_dph: '',
        is_ico_dic: false,
      },
      setShippingInfo: (newInfo) =>
        set((state) => ({
          shippingInfo: { ...state.shippingInfo, ...newInfo },
        })),
      resetShippingInfo: () =>
        set(() => ({
          shippingInfo: {
            name: '',
            address: '',
            city: '',
            zip: '',
            country: '',
            phone: '',
            note: '',
            is_billing_address: false,
            billing_name: '',
            billing_address: '',
            billing_city: '',
            billing_zip: '',
            billing_country: '',
            billing_ico: '',
            billing_dic: '',
            billing_ico_dph: '',
            is_ico_dic: false,
          },
        })),
    }),
    {
      name: 'shipping-storage', // Key in localStorage
      storage: createJSONStorage(() => sessionStorage),
      // partialize: (state) => ({ shippingInfo: state.shippingInfo }), // Save only shippingInfo
    },
  ),
)

export default useShippingStore
