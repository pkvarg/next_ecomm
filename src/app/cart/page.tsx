'use client'
import React, { useState } from 'react'
import useCartStore from '@/store/cartStore'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import Image from 'next/image'
import { Nav, NavLink } from '@/components/Nav'
import { BsTrash } from 'react-icons/bs'
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

  const increment = (id: string, qty: number) => {
    updateItemQty(id, qty + 1)
  }

  const decrement = (id: string, qty: number) => {
    if (qty > 1) {
      updateItemQty(id, qty - 1)
    } else updateItemQty(id, 1)
  }

  function roundUpToNearestTenth(price: number) {
    return Math.ceil(price * 10) / 10
  }

  const totalItemsQty = items.map((item) => item.qty).reduce((total, qty) => total + qty, 0) // Sum them up

  const totalItemsPrice =
    items.reduce((total, item) => total + item.priceInCents * item.qty, 0) / 100

  // TODO postage, tax to .env
  const postage = process.env.NEXT_PUBLIC_POSTAGE
  const tax = process.env.NEXT_PUBLIC_TAX
  const total = totalItemsPrice + 5
  const taxFromTotal = (total * 25) / 100
  const totalWithTax = roundUpToNearestTenth(total + taxFromTotal).toFixed(2)

  return (
    <div>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
      </Nav>
      <h1 className="text-center my-4 text-[32px]">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-4 mx-4 lg:mx-[10%]">
        <div className="flex flex-col lg:w-[75%]">
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
                  width={50}
                  height={50}
                  alt={item.name}
                  priority
                  className="w-auto h-auto"
                />
              </div>

              <div className="flex flex-col">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>
                  <span className="line-clamp-4">{item.description}</span>

                  {formatCurrency(item.priceInCents / 100)}
                </CardDescription>
                <div className="flex gap-4 ml-[62.5%] lg:ml-auto -mt-4 items-center">
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
            <p className="font-bold mt-2">Postage: {totalItemsQty && postage}&#8364;</p>
            <p className="font-bold mt-2">Tax: {totalItemsQty && tax}%</p>
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

// export function ProductCardSkeleton() {
//   return (
//     <Card className='overflow-hidden flex flex-col animate-pulse'>
//       <div className='w-full aspect-video bg-gray-300' />
//       <CardHeader>
//         <CardTitle>
//           <div className='w-3/4 h-6 rounded-full bg-gray-300' />
//         </CardTitle>
//         <CardDescription>
//           <div className='w-1/2 h-4 rounded-full bg-gray-300' />
//         </CardDescription>
//       </CardHeader>
//       <CardContent className='space-y-2'>
//         <div className='w-full h-4 rounded-full bg-gray-300' />
//         <div className='w-full h-4 rounded-full bg-gray-300' />
//         <div className='w-3/4 h-4 rounded-full bg-gray-300' />
//       </CardContent>
//       <CardFooter>
//         <Button className='w-full' disabled size='lg'></Button>
//       </CardFooter>
//     </Card>
//   )
// }

export default Cart
