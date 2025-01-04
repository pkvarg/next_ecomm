'use server'

import db from '@/db/db'
import { notFound } from 'next/navigation'

export async function deleteUser(id: string) {
  const user = await db.user.delete({
    where: { id },
  })

  if (user == null) return notFound()

  return user
}

export async function getAllUsers() {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      subscriber: true,
      lastLogin: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}
