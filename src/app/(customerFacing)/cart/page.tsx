'use client'
import React, { useState } from 'react'
import useCartStore from '@/store/cartStore'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import Image from 'next/image'

import { BsTrash } from 'react-icons/bs'
import { FaRegFile } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const Cart = () => {
  const router = useRouter()

  const goToHome = () => {
    router.push('/') // Navigate to the home page
  }

  const goToShipping = () => {
    router.push('/shipping') // Navigate to the home page
  }

  const { items, updateItemQty, removeFromCart } = useCartStore((state) => state)

  const isThereNoFileProd = items.some((prod) => prod.filePath === null)

  const increment = (id: string, qty: number) => {
    updateItemQty(id, qty + 1)
  }

  const decrement = (id: string, qty: number) => {
    if (qty > 1) {
      updateItemQty(id, qty - 1)
    } else updateItemQty(id, 1)
  }

  const totalItemsQty = items.map((item) => item.qty).reduce((total, qty) => total + qty, 0) // Sum them up

  const totalItemsPrice =
    items.reduce((total, item) => total + item.priceInCents * item.qty, 0) / 100

  const postage = isThereNoFileProd ? process.env.NEXT_PUBLIC_POSTAGE! : '0'
  const tax = process.env.NEXT_PUBLIC_TAX!
  const total = totalItemsPrice + parseInt(postage)
  const taxFromTotal = (total * parseInt(tax)) / 100
  const totalWithTax = (total + taxFromTotal).toFixed(2)

  return (
    <div>
      <h1 className="text-center my-4 text-[32px]">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-4 mx-4 lg:mx-[10%]">
        <div className="flex flex-col lg:w-[75%] mx-4">
          {items.length === 0 && (
            <div className="flex flex-col justify-center items-center mt-16">
              <h1 className="text-[25px] text-center">Your Cart is Empty</h1>
              <button
                onClick={goToHome}
                className="bg-blue-500 text-gray-50 p-2 mt-2 cursor-pointer hover:bg-blue-800 "
              >
                Start shopping
              </button>
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex overflow-hidden flex-row my-8">
              <div className="relative m-2">
                <Image
                  src={item.imagePath || '/products/dummy_prod.webp'}
                  width={75}
                  height={75}
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
                  <span className="line-clamp-4 mt-2 text-justify max-w-[90%]">
                    {item.description}
                  </span>

                  {formatCurrency(item.priceInCents / 100)}
                </CardDescription>
                {!item.filePath ? (
                  <div className="flex gap-4 ml-[62.5%] lg:ml-auto mt-4 items-center">
                    <p onClick={() => decrement(item.id, item.qty)} className="cursor-pointer">
                      -
                    </p>
                    <h1>{item.qty}</h1>

                    <p onClick={() => increment(item.id, item.qty)} className="cursor-pointer">
                      +
                    </p>
                    <p onClick={() => removeFromCart(item.id)} className="cursor-pointer">
                      <BsTrash />
                    </p>
                  </div>
                ) : (
                  <p onClick={() => removeFromCart(item.id)} className="cursor-pointer ml-auto">
                    <BsTrash />
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* cart totals */}
        <div
          className={
            items.length > 0
              ? 'mt-0 bg-gray-100 lg:w-[25%] h-fit lg:mt-0'
              : 'mt-16  bg-gray-100 lg:w-[25%] h-fit lg:mt-0'
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
            <button
              onClick={goToShipping}
              className="bg-gray-500 text-gray-50 p-2 mt-2 w-full cursor-pointer hover:bg-gray-700"
            >
              Go to Checkout
            </button>
            <button
              onClick={goToHome}
              className="bg-blue-500 text-gray-50 p-2 mt-2 w-full cursor-pointer hover:bg-blue-800"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
