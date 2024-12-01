'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import GoBack from '@/components/GoBack'
import { useForm, SubmitHandler } from 'react-hook-form'

const ShippingPage = () => {
  // TODO react form
  const router = useRouter()

  const { register, handleSubmit, watch } = useForm()

  const isBillingAddress = watch('is_billing_address', false) // Default to false
  const isIcoDic = watch('is_ico_dic', false) // Default to false

  const onSubmit = (data: any) => {
    console.log('submitted payment info', data)
  }

  return (
    <div>
      <GoBack />
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-center my-4 text-[32px]">Shipping</h1>
        <h2 className="text-[24px] my-4 text-center">Delivery Address: </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-fit">
          <input {...register('name')} placeholder="Name" className="border pl-1" />
          <input {...register('address')} placeholder="Address" className="border pl-1" />
          <input {...register('city')} placeholder="City" className="border pl-1" />
          <input {...register('zip')} placeholder="ZIP Code" className="border pl-1" />
          <input {...register('country')} placeholder="Country" className="border pl-1" />
          <input {...register('phone')} placeholder="Phone" className="border pl-1" />
          <input {...register('note')} placeholder="Note" className="border pl-1" />
          <div className="flex flex-row gap-2 my-4">
            <input type="checkbox" {...register('is_billing_address')} className="w-[20px]" />
            Billing Address is different from Delivery Address
          </div>

          {isBillingAddress && (
            <>
              <input
                {...register('billing_name')}
                placeholder="Name / Company"
                className="border pl-1"
              />
              <input
                {...register('billing_address')}
                placeholder="Address"
                className="border pl-1"
              />
              <input {...register('billing_city')} placeholder="City" className="border pl-1" />
              <input {...register('billing_zip')} placeholder="ZIP Code" className="border pl-1" />
              <input
                {...register('billing_country')}
                placeholder="Country"
                className="border pl-1"
              />

              <div className="flex flex-row gap-2 my-4">
                <input type="checkbox" {...register('is_ico_dic')} className="w-[20px]" />
                IČO / DIČ / IČ DPH
              </div>
              {isIcoDic && (
                <>
                  <input {...register('billing_ico')} placeholder="IČO" className="border pl-1" />
                  <input {...register('billing_dic')} placeholder="DIČ" className="border pl-1" />
                  <input
                    {...register('billing_ico_dph')}
                    placeholder="IČ DPH"
                    className="border pl-1"
                  />
                </>
              )}
            </>
          )}

          <button
            type="submit"
            //onClick={() => router.push('/payment-type')}
            className="bg-blue-500 text-gray-50 p-2 w-fit cursor-pointer hover:bg-blue-800 mt-8 ml-auto"
          >
            Continue to Payment Info &#8594;
          </button>
          {/* <button type="submit" className=''>Submit</button> */}
        </form>
        {/* <button
        onClick={() => router.push('/payment-type')}
        className="bg-blue-500 text-gray-50 p-2 w-fit cursor-pointer hover:bg-blue-800 mt-8"
      >
        Continue to Payment Info
      </button> */}
      </div>
    </div>
  )
}

export default ShippingPage
