import { Product } from '@prisma/client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// TODO PUT TO PRISMA and call it as here

interface ShippingInfo {
  name: string
  street: string
  house_number: string
  city: string
  zip: string
  country: string
  phone: string
  note: string
  is_billing_address: boolean
  billing_name: string
  billing_street: string
  billing_house_number: string
  billing_city: string
  billing_zip: string
  billing_country: string
  billing_ico: string
  billing_dic: string
  billing_ico_dph: string
  is_ico_dic: boolean
  payment_type: string
  cash: boolean
  stripe: boolean
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
        street: '',
        house_number: '',
        city: '',
        zip: '',
        country: '',
        phone: '',
        note: '',
        is_billing_address: false,
        billing_name: '',
        billing_street: '',
        billing_house_number: '',
        billing_city: '',
        billing_zip: '',
        billing_country: '',
        billing_ico: '',
        billing_dic: '',
        billing_ico_dph: '',
        is_ico_dic: false,
        payment_type: '',
        cash: false,
        stripe: false,
      },
      setShippingInfo: (newInfo) =>
        // set((state) => ({
        //   shippingInfo: { ...state.shippingInfo, ...newInfo },
        // })),
        set((state) => {
          // Determine payment_type based on newInfo.cash or newInfo.stripe
          let paymentType = state.shippingInfo.payment_type // Preserve the current value by default
          if (newInfo.cash) paymentType = 'cash'
          if (newInfo.stripe) paymentType = 'stripe'

          return {
            shippingInfo: {
              ...state.shippingInfo,
              ...newInfo,
              payment_type: paymentType, // Override with determined value
            },
          }
        }),
      resetShippingInfo: () =>
        set(() => ({
          shippingInfo: {
            name: '',
            street: '',
            house_number: '',
            city: '',
            zip: '',
            country: '',
            phone: '',
            note: '',
            is_billing_address: false,
            billing_name: '',
            billing_street: '',
            billing_house_number: '',
            billing_city: '',
            billing_zip: '',
            billing_country: '',
            billing_ico: '',
            billing_dic: '',
            billing_ico_dph: '',
            is_ico_dic: false,
            payment_type: '',
            cash: false,
            stripe: false,
          },
        })),
    }),
    {
      name: 'shipping-storage', // Key in localStorage
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export default useShippingStore
