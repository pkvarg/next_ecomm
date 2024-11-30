'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import GoBack from '@/components/GoBack'
import { useForm, SubmitHandler } from 'react-hook-form'

const ShippingPage = () => {
  // TODO react form
  const router = useRouter()

  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <div>
      <GoBack />
      <h1 className="text-center my-4 text-[32px]">Shipping</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('username')} placeholder="Username" />
        <button type="submit">Submit</button>
      </form>
      <button
        onClick={() => router.push('/payment-type')}
        className="bg-blue-500 text-gray-50 p-2 mt-2 w-fit cursor-pointer hover:bg-blue-800"
      >
        Continue to Payment Info
      </button>
    </div>
  )
}

export default ShippingPage
