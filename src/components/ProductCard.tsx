'use client'
import { formatCurrency } from '@/lib/formatters'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'
import useCartStore from '@/store/cartStore'
import { FaRegFile } from 'react-icons/fa'
import { Product } from '../../types/types'

import { useState } from 'react'

type ProductCardProps = {
  id: string
  name: string
  priceInCents: number
  description: string
  imagePath: string
}

interface ProductTypes extends Product {}

export function ProductCard(product: ProductTypes) {
  const { addToCart, updateItemQty } = useCartStore((state) => state)
  const [count, setCount] = useState(1)

  const increment = () => {
    setCount((prev) => prev + 1)
    updateItemQty(product.id, count)
  }

  const decrement = () => {
    if (count > 0) {
      setCount((prev) => prev - 1)
      updateItemQty(product.id, count)
    } else setCount(0)
  }

  return (
    <Card className="flex overflow-hidden flex-col">
      <div className="relative w-full h-auto aspect-video">
        <Image src={product.imagePath} fill sizes="50" alt={product.name} priority />
      </div>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <CardTitle>{product.name}</CardTitle>
          {!product.filePath && <FaRegFile className="text-[25px]" />}
        </div>

        <CardDescription>{formatCurrency(product.priceInCents / 100)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4 text-left">{product.description}</p>

        {product.filePath && (
          <div className="flex gap-4 flex-row justify-end mr-8">
            <p onClick={decrement} className="cursor-pointer">
              -
            </p>
            <h1>{count}</h1>

            <p onClick={increment} className="cursor-pointer">
              +
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild size="lg" className="w-full" onClick={() => addToCart(product, count)}>
          {/* <Link href={`/products/${id}/purchase`}>Purchase</Link> */}
          <p>Add to Cart</p>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <div className="w-1/2 h-4 rounded-full bg-gray-300" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-3/4 h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled size="lg"></Button>
      </CardFooter>
    </Card>
  )
}
