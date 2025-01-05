'use server'

import db from '@/db/db'
import { notFound } from 'next/navigation'

export async function deleteOrder(id: string) {
  const order = await db.order.delete({
    where: { id },
  })

  if (order == null) return notFound()

  return order
}

export async function getAllOrders() {
  return db.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      pricePaidInCents: true,
      userId: true,
      userEmail: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}
