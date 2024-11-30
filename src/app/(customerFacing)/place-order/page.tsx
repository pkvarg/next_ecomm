'use client'
import GoBack from '@/components/GoBack'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import useCartStore from '@/store/cartStore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const PlaceOrder = () => {
  // TODO agree Tick form

  const router = useRouter()

  const placeOrder = () => {
    // ...logic
  }

  const { items } = useCartStore((state) => state)

  function roundUpToNearestTenth(price: number) {
    return Math.ceil(price * 10) / 10
  }

  const totalItemsQty = items.map((item) => item.qty).reduce((total, qty) => total + qty, 0) // Sum them up

  const totalItemsPrice =
    items.reduce((total, item) => total + item.priceInCents * item.qty, 0) / 100

  const postage = 5
  const tax = 25
  const total = totalItemsPrice + 5
  const taxFromTotal = (total * 25) / 100
  const totalWithTax = roundUpToNearestTenth(total + taxFromTotal).toFixed(2)

  return (
    <div>
      <GoBack />

      <h1 className="text-center my-4 text-[32px]">PlaceOrder</h1>
      <div className="flex flex-col lg:flex-row gap-4 mx-4 lg:mx-[10%]">
        <div className="flex flex-col lg:w-[65%]">
          <h1>Delivery Info</h1>
          <div className="h-[1px] bg-gray-400 w-full my-2"></div>
          <h2>Payment Type</h2>
          <div className="h-[1px] bg-gray-400 w-full my-2"></div>
          <h3>Your Products</h3>
          <div className="h-[1px] bg-gray-400 w-full my-2"></div>
          {items.map((item) => (
            <div key={item.id} className="flex overflow-hidden flex-row my-8">
              <div className="relative m-2">
                <Image src={item.imagePath} width={50} height={50} alt={item.name} priority />
              </div>

              <div className="flex flex-col">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>
                  <span className="line-clamp-4">{item.description}</span>

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
            <p className="font-bold mt-2">Postage: {totalItemsQty && postage}&#8364;</p>
            <p className="font-bold mt-2">Tax: {totalItemsQty && tax}%</p>
            <p className="font-bold mt-2">Total: {totalItemsQty && totalWithTax}&#8364;</p>
            <div className="h-[1px] bg-gray-400 w-full my-2"></div>
            <p onClick={() => router.push('/terms')} className="mt-2 text-[15px]">
              I agree with <span className="underline cursor-pointer">Terms and Conditions</span>
            </p>
            <p onClick={() => router.push('/gdpr')} className="mt-2 text-[15px]">
              I agrees with <span className="underline cursor-pointer">GDPR</span>
            </p>

            <button
              onClick={placeOrder}
              className="bg-blue-500 text-gray-50 p-2 mt-2 w-full cursor-pointer hover:bg-blue-800"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
