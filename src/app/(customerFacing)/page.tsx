'use client'

import { ProductCard, ProductCardSkeleton } from './../../components/ProductCard'
import { Button } from '@/components/ui/button'
import db from '@/db/db'
import { cache } from '../../lib/cache'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { resolve } from 'path'
import SearchBar from '@/components/SearchBar'
import { getAllProducts } from '@/actions/products'

interface Product {
  id: string
  name: string
  priceInCents: number
  filePath: string | null // Changed from string | undefined to string | null
  imagePath: string
  description: string | null // Changed from string | undefined to string | null
  isAvailableForPurchase: boolean
  createdAt: Date
  updatedAt: Date
  countInStock: number
  qty: number
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getAllProducts()
      if (searchQuery.trim() === '') {
        setFilteredProducts(allProducts)
      } else {
        setFilteredProducts(
          allProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        )
      }
    }
    fetchProducts()
  }, [searchQuery])

  return (
    <main className="space-y-12">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ProductGridSection title="" products={filteredProducts} />
    </main>
  )
}

type ProductGridSectionProps = {
  title: string
  products: Product[]
}

function ProductGridSection({ title, products }: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} {...product} />)
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  )
}
