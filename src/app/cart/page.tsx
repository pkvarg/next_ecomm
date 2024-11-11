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
import { Nav, NavLink } from '@/components/Nav'

const Cart = () => {
  const { items, updateItemQty, removeFromCart } = useCartStore(
    (state) => state
  )
  //const [count, setCount] = useState(1)
  // Thrash delete from cart

  const increment = (id: string, qty: number) => {
    updateItemQty(id, qty + 1)
  }

  const decrement = (id: string, qty: number) => {
    if (qty > 1) {
      updateItemQty(id, qty - 1)
    } else updateItemQty(id, 1)
  }

  console.log('items cart', items)

  return (
    <div>
      <Nav>
        <NavLink href='/'>Home</NavLink>
        <NavLink href='/products'>Products</NavLink>
        <NavLink href='/orders'>My Orders</NavLink>
      </Nav>
      <h1 className='text-center my-4 text-[32px]'>Your Cart</h1>
      {items.map((item) => (
        <div key={item.id} className='flex overflow-hidden flex-row my-8'>
          <div className='relative m-2'>
            <Image
              src={item.imagePath}
              width={50}
              height={50}
              alt={item.name}
              priority
            />
          </div>

          <div className='flex flex-col'>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>
              <p className='line-clamp-4'>{item.description}</p>

              {formatCurrency(item.priceInCents / 100)}
            </CardDescription>
            <div className='flex gap-4 ml-auto -mt-4'>
              <p
                onClick={() => decrement(item.id, item.qty)}
                className='cursor-pointer'
              >
                -
              </p>
              <h1>{item.qty}</h1>

              <p
                onClick={() => increment(item.id, item.qty)}
                className='cursor-pointer'
              >
                +
              </p>
              <p onClick={() => removeFromCart(item.id)} className='bg-red-600'>
                Delete
              </p>
            </div>
          </div>
        </div>
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
