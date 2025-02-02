'use client'

import { ProductCard, ProductCardSkeleton } from './../../components/ProductCard'
import { Button } from '@/components/ui/button'
import db from '@/db/db'
import { cache } from '../../lib/cache'
import { Product } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { resolve } from 'path'
import SearchBar from '@/components/SearchBar'
import { getAllProducts } from '@/actions/products'

// const getMostPopularProducts = cache(
//   () => {
//     return db.product.findMany({
//       where: { isAvailableForPurchase: true },
//       //orderBy: { orders: { _count: 'desc' } },
//       take: 6,
//     })
//   },
//   ['/', 'getMostPopularProducts'],
//   { revalidate: 60 * 60 * 24 },
// )

// const getNewestProducts = cache(() => {
//   return db.product.findMany({
//     where: { isAvailableForPurchase: true },
//     orderBy: { createdAt: 'desc' },
//     take: 6,
//   })
// }, ['/', 'getNewestProducts'])

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
      {/* <ProductGridSection title="Most Popular" productsFetcher={getMostPopularProducts} />
      <ProductGridSection title="Newest" productsFetcher={getNewestProducts} /> */}
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
      {/* <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div> */}
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

// type ProductGridSectionProps = {
//   title: string
//   productsFetcher: () => Promise<Product[]>
// }

// function ProductGridSection({ productsFetcher, title }: ProductGridSectionProps) {
//   return (
//     <div className="space-y-4">
//       <div className="flex gap-4">
//         <h2 className="text-3xl font-bold">{title}</h2>
//         <Button variant="outline" asChild>
//           <Link href="/products" className="space-x-2">
//             <span>View All</span>
//             <ArrowRight className="size-4" />
//           </Link>
//         </Button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Suspense
//           fallback={
//             <>
//               <ProductCardSkeleton />
//               <ProductCardSkeleton />
//               <ProductCardSkeleton />
//             </>
//           }
//         >
//           <ProductSuspense productsFetcher={productsFetcher} />
//         </Suspense>
//       </div>
//     </div>
//   )
// }

// async function ProductSuspense({ productsFetcher }: { productsFetcher: () => Promise<Product[]> }) {
//   return (await productsFetcher()).map((product: any) => (
//     <ProductCard key={product.id} {...product} />
//   ))
// }
