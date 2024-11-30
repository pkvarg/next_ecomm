'use client'
import GoBack from '@/components/GoBack'
import { useRouter } from 'next/navigation'
import React from 'react'

const PaymentType = () => {
  const router = useRouter()

  return (
    <div>
      <GoBack />
      <h1 className="text-center my-4 text-[32px]">PaymentType</h1>
      <button
        onClick={() => router.push('/place-order')}
        className="bg-blue-500 text-gray-50 p-2 mt-2 w-fit cursor-pointer hover:bg-blue-800"
      >
        Continue to Place Order
      </button>
    </div>
  )
}

export default PaymentType
