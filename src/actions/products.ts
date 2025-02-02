'use server'
import db from '@/db/db'
import { revalidateTag } from 'next/cache'

export async function getAllProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
  })
}

// Call this whenever you need to refresh the cache
export async function refreshProducts() {
  revalidateTag('products')
}
