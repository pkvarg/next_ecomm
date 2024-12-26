'use client'
import React from 'react'
import useShippingStore from '@/store/shippingStore'
import useCartStore from '@/store/cartStore'
import { useRouter } from 'next/navigation'

const ResetStoreButton = () => {
  const router = useRouter()
  const { resetShippingInfo } = useShippingStore()
  const { resetCart } = useCartStore()

  const reset = () => {
    resetShippingInfo()
    resetCart()
    router.push('/')
  }

  return (
    <button
      onClick={reset}
      className="bg-blue-500 text-gray-50 p-2 mt-2 w-full cursor-pointer hover:bg-blue-800"
    >
      Create new Order
    </button>
  )
}

export default ResetStoreButton
