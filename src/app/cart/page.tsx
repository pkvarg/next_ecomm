'use client'
import React, { useState } from 'react'
import useCartStore from '@/store/cartStore'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@react-email/components'
import { formatCurrency } from '@/lib/formatters'
import Image from 'next/image'

const Cart = () => {
  const { items, addToCart, updateItemQty } = useCartStore((state) => state)
  const [count, setCount] = useState(1)

  const increment = () => {
    setCount((prev) => prev + 1)
    //updateItemQty(product.id, count)
  }

  const decrement = () => {
    setCount((prev) => prev - 1)
    //updateItemQty(product.id, count)
  }

  console.log('items cart', items)

  return (
    <div>
      <h1>Cart</h1>
      {items.map((item) => (
        <Card key={item.id} className='flex overflow-hidden flex-col'>
          <div className='relative w-full h-auto aspect-video'>
            <Image
              src={item.imagePath}
              width={150}
              height={150}
              alt={item.name}
              priority
            />
          </div>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>
              {formatCurrency(item.priceInCents / 100)}
            </CardDescription>
          </CardHeader>
          <CardContent className='flex-grow'>
            <p className='line-clamp-4'>{item.description}</p>

            <div className='flex gap-4 text-[20px]'>
              <p onClick={decrement} className='cursor-pointer'>
                -
              </p>
              <h1>{count}</h1>

              <p onClick={increment} className='cursor-pointer'>
                +
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
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
