'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const GoBack = () => {
  const router = useRouter()
  const goBack = () => {
    router.back()
  }
  return (
    <button
      onClick={goBack}
      className="bg-blue-500 text-gray-50 p-2 mt-2 w-16 cursor-pointer hover:bg-blue-800"
    >
      Back
    </button>
  )
}

export default GoBack
