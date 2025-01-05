'use client'
import GoBack from '@/components/GoBack'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import useCartStore from '@/store/cartStore'
import useUserStore from '@/store/userStore'
import useShippingStore from '@/store/shippingStore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { createNewOrder } from '@/actions/orders'
import { Order } from '../../../../types/types'
import { FaRegFile } from 'react-icons/fa'

const PlaceOrder = () => {
  const router = useRouter()

  const [agreeGdpr, setAgreeGdpr] = useState(true)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [agreeNewsletter, setAgreeNewsletter] = useState(true)

  const { items } = useCartStore((state) => state)
  const { shippingInfo } = useShippingStore()

  const totalItemsQty = items.map((item) => item.qty).reduce((total, qty) => total + qty, 0) // Sum them up

  const totalItemsPrice =
    items.reduce((total, item) => total + item.priceInCents * item.qty, 0) / 100

  const isThereNoFileProd = items.some((prod) => prod.filePath === null)

  const postage = isThereNoFileProd ? process.env.NEXT_PUBLIC_POSTAGE! : '0' // will depend on country
  const tax = process.env.NEXT_PUBLIC_TAX!
  const total = totalItemsPrice + parseInt(postage)
  const taxCalc = (total * parseInt(tax)) / 100
  const taxFromTotal = Number(taxCalc.toFixed(2))
  const totalWithTax = (total + taxFromTotal).toFixed(2)
  const totalWithTaxInCents = parseFloat(totalWithTax) * 100

  const { email, id: userId } = useUserStore()
  const newOrder: Order = {
    orderNumber: '',
    newsletter: agreeNewsletter,
    pricePaidInCents: totalWithTaxInCents,
    productTotalsPrice: totalItemsPrice,
    postage: parseInt(postage),
    tax: taxFromTotal,
    userId,
    userEmail: email,
    shippingInfo: shippingInfo,
    products: items,
    isCancelled: false,
  }

  const placeOrder = async (e: any) => {
    e.preventDefault()
    const order = await createNewOrder(newOrder)
    const orderId = order?.id

    //...logic cash or stripe
    if (shippingInfo.payment_type === 'stripe') {
      if (orderId) {
        router.push(`/pay-stripe/${orderId}`)
      }
    } else {
      if (orderId) {
        router.push(`/order/${orderId}`)
      }
    }
  }

  return (
    <div>
      <GoBack />

      <h1 className="text-center my-4 text-[32px]">Place Order</h1>
      <div className="flex flex-col lg:flex-row gap-4 mx-0 lg:mx-[10%]">
        <div className="flex flex-col lg:w-[65%]">
          <h1 className="font-bold">Delivery Info: </h1>
          <p>
            {shippingInfo.name}
            {', '}
            {shippingInfo.street}
            {', '}
            {shippingInfo.house_number}
            {', '}
            {shippingInfo.city}
            {', '}
            {shippingInfo.country}
            {', '}
            {shippingInfo.zip}
          </p>
          {shippingInfo.note && <h2>Note: {shippingInfo.note}</h2>}

          {shippingInfo.is_billing_address && (
            <>
              <h1 className="font-bold">Billing Info: </h1>
              <p>
                {shippingInfo.billing_name}
                {', '}
                {shippingInfo.billing_street}
                {', '}
                {shippingInfo.billing_house_number}
                {', '}
                {shippingInfo.billing_city}
                {', '}
                {shippingInfo.billing_country}
                {', '}
                {shippingInfo.billing_zip}
              </p>
              {shippingInfo.is_ico_dic && (
                <>
                  <p>IČO: {shippingInfo.billing_ico}</p>
                  <p>DIČ: {shippingInfo.billing_dic}</p>
                  <p>IČ DPH: {shippingInfo.billing_ico_dph}</p>
                </>
              )}
            </>
          )}

          <div className="h-[1px] bg-gray-400 w-full my-2"></div>
          <h2 className="font-bold">
            Payment Type:
            <span className="capitalize font-normal"> {shippingInfo.payment_type}</span>
          </h2>
          <div className="h-[1px] bg-gray-400 w-full my-2"></div>
          <h3 className="font-bold">Your Products: </h3>

          {items.map((item) => (
            <div key={item.id} className="flex overflow-hidden flex-row my-8">
              <div className="relative m-2">
                <Image
                  src={item.imagePath || ''}
                  width={50}
                  height={50}
                  alt={item.name}
                  priority
                  className="w-auto h-auto"
                />
              </div>

              <div className="flex flex-col mt-2">
                <div className="flex flex-row justify-between gap-4">
                  <CardTitle>{item.name}</CardTitle>
                  {item.filePath && <FaRegFile className="text-[25px]" />}
                </div>
                <CardDescription>
                  <span className="line-clamp-4 mt-2 max-w-[90%] text-justify">
                    {item.description}
                  </span>

                  {formatCurrency(item.priceInCents / 100)}
                </CardDescription>
              </div>
            </div>
          ))}
          <div className="h-[1px] bg-gray-400 w-full my-2"></div>
        </div>
        {/* cart totals */}
        <div
          className={
            items.length > 0
              ? 'mt-0 bg-gray-100 lg:w-[35%] h-fit lg:mt-0'
              : 'mt-16  bg-gray-100 lg:w-[35%] h-fit lg:mt-0'
          }
        >
          <div className="mx-4 my-4">
            <p className="font-bold mt-2">Total Items: ({totalItemsQty})</p>
            <p className="font-bold mt-2">Products: {totalItemsPrice}&#8364;</p>
            {isThereNoFileProd && (
              <p className="font-bold mt-2">Postage: {totalItemsQty && postage}&#8364;</p>
            )}

            <p className="font-bold mt-2">Tax: {totalItemsQty && taxFromTotal.toFixed(2)}&#8364;</p>
            <p className="font-bold mt-2">Total: {totalItemsQty && totalWithTax}&#8364;</p>
            <div className="h-[1px] bg-gray-400 w-full my-2"></div>

            <form onSubmit={placeOrder}>
              <div className="flex flex-row gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={agreeTerms} // Controlled by state
                  onChange={() => setAgreeTerms((prev) => !prev)}
                  className="w-[20px]"
                  required
                />
                I agree with{' '}
                <span
                  onClick={() => router.push('/terms')}
                  className="underline cursor-pointer text-[12.5px] mt-[2.5px]"
                >
                  Terms and Conditions
                </span>
              </div>

              <div className="flex flex-row gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={agreeGdpr} // Controlled by state
                  onChange={() => setAgreeGdpr((prev) => !prev)}
                  className="w-[20px]"
                  required
                />{' '}
                I agree with{' '}
                <span
                  onClick={() => router.push('/gdpr')}
                  className="underline cursor-pointer text-[12.5px] mt-[2.5px]"
                >
                  GDPR
                </span>
              </div>

              <div className="flex flex-row gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={agreeNewsletter} // Controlled by state
                  onChange={() => setAgreeNewsletter((prev) => !prev)}
                  className="w-[20px]"
                />
                I subscribe to Newsletter
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-gray-50 p-2 mt-2 w-full cursor-pointer hover:bg-blue-800"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
