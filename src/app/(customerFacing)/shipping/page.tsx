'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import GoBack from '@/components/GoBack'
import { useForm, SubmitHandler } from 'react-hook-form'
import useShippingStore from '@/store/shippingStore'

const ShippingPage = () => {
  // TODO react form
  const router = useRouter()
  const { shippingInfo, setShippingInfo } = useShippingStore()
  const { register, handleSubmit, watch, reset } = useForm()

  const isBillingAddress = watch('is_billing_address', shippingInfo.is_billing_address)
  const isIcoDic = watch('is_ico_dic', shippingInfo.is_ico_dic)

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
        <h1 className="text-center my-4 text-[32px]">Shipping</h1>
        <h2 className="text-[24px] my-4 text-center">Delivery Address: </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-fit">
          <input
            {...register('name')}
            placeholder="Name"
            defaultValue={shippingInfo.name}
            required
            className="border pl-1"
          />
          <input
            {...register('address')}
            placeholder="Address"
            defaultValue={shippingInfo.address}
            required
            className="border pl-1"
          />
          <input
            {...register('city')}
            placeholder="City"
            defaultValue={shippingInfo.city}
            required
            className="border pl-1"
          />
          <input
            {...register('zip')}
            placeholder="ZIP Code"
            defaultValue={shippingInfo.zip}
            required
            className="border pl-1"
          />
          <input
            {...register('country')}
            placeholder="Country"
            defaultValue={shippingInfo.country}
            required
            className="border pl-1"
          />
          <input
            {...register('phone')}
            placeholder="Phone"
            defaultValue={shippingInfo.phone}
            required
            className="border pl-1"
          />
          <input
            {...register('note')}
            placeholder="Note"
            defaultValue={shippingInfo.note}
            className="border pl-1"
          />
          <div className="flex flex-row gap-2 my-4">
            <input type="checkbox" {...register('is_billing_address')} className="w-[20px]" />
            Billing Address is different from Delivery Address
          </div>

          {isBillingAddress && (
            <>
              <input
                {...register('billing_name')}
                placeholder="Name / Company"
                defaultValue={shippingInfo.billing_name}
                className="border pl-1"
              />
              <input
                {...register('billing_address')}
                placeholder="Address"
                defaultValue={shippingInfo.billing_address}
                className="border pl-1"
              />
              <input
                {...register('billing_city')}
                placeholder="City"
                defaultValue={shippingInfo.billing_city}
                className="border pl-1"
              />
              <input {...register('billing_zip')} placeholder="ZIP Code" className="border pl-1" />
              <input
                {...register('billing_country')}
                placeholder="Country"
                defaultValue={shippingInfo.billing_country}
                className="border pl-1"
              />

              <div className="flex flex-row gap-2 my-4">
                <input type="checkbox" {...register('is_ico_dic')} className="w-[20px]" />
                IČO / DIČ / IČ DPH
              </div>
              {isIcoDic && (
                <>
                  <input
                    {...register('billing_ico')}
                    placeholder="IČO"
                    defaultValue={shippingInfo.billing_ico}
                    className="border pl-1"
                  />
                  <input
                    {...register('billing_dic')}
                    placeholder="DIČ"
                    defaultValue={shippingInfo.billing_dic}
                    className="border pl-1"
                  />
                  <input
                    {...register('billing_ico_dph')}
                    placeholder="IČ DPH"
                    defaultValue={shippingInfo.billing_ico_dph}
                    className="border pl-1"
                  />
                </>
              )}
            </>
          )}

          <button
            type="submit"
            onClick={() => router.push('/payment-type')}
            className="bg-blue-500 text-gray-50 p-2 w-fit cursor-pointer hover:bg-blue-800 mt-8 ml-auto"
          >
            Continue to Payment Info &#8594;
          </button>
        </form>
      </div>
    </div>
  )
}

export default ShippingPage
