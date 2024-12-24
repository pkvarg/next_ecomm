'use client'
import GoBack from '@/components/GoBack'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import useShippingStore from '@/store/shippingStore'
import React from 'react'

const PaymentType = () => {
  const router = useRouter()
  const { register, handleSubmit, watch, reset } = useForm()
  const { shippingInfo, setShippingInfo } = useShippingStore()

  const cash = watch('cash', shippingInfo.payment_type)
  const stripe = watch('stripe', shippingInfo.payment_type)
  const bank = watch('bank', shippingInfo.payment_type)

  const onSubmit = (data: object) => {
    setShippingInfo(data)
  }

  React.useEffect(() => {
    reset(shippingInfo)
  }, [shippingInfo, reset])

  return (
    <div>
      <GoBack />
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-center my-4 text-[32px]">PaymentType</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-fit">
          <div className="flex flex-row gap-2 mt-6">
            <input
              type="checkbox"
              {...register('cash')}
              disabled={stripe || bank}
              className="w-[20px]"
            />
            Cash
          </div>
          <div className="flex flex-row gap-2">
            <input
              type="checkbox"
              {...register('stripe')}
              disabled={cash || bank}
              className="w-[20px]"
            />
            Card (Stripe)
          </div>
          <div className="flex flex-row gap-2">
            <input
              type="checkbox"
              {...register('bank')}
              disabled={stripe || cash}
              className="w-[20px]"
            />
            Bank transfer
          </div>

          <button
            type="submit"
            onClick={() => router.push('/place-order')}
            className={`p-2 w-fit mt-8 ml-auto ${
              !cash && !stripe && !bank
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' // Disabled state
                : 'bg-blue-500 text-gray-50 hover:bg-blue-800 cursor-pointer' // Enabled state
            }`}
            disabled={!cash && !stripe && !bank} // Disable condition
          >
            Continue to Place Order &#8594;
          </button>
        </form>
      </div>
    </div>
  )
}

export default PaymentType
