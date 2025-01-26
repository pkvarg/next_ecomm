'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

interface GoToPayOrderProps {
  orderId: string
}

const GoToPayOrder: React.FC<GoToPayOrderProps> = ({ orderId }) => {
  const router = useRouter()

  const goToPay = () => {
    router.push(`/pay-stripe/${orderId}`)
  }

  return (
    <button
      onClick={goToPay}
      className="bg-green-500 text-gray-50 p-2 mt-2 w-full cursor-pointer hover:text-green-500 hover:bg-white hover:border-green-500 border-2"
    >
      Pay Order
    </button>
  )
}

export default GoToPayOrder
