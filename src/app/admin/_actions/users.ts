'use server'

import db from '@/db/db'
import { isAuthAdmin } from '@/lib/isAuth'
import { notFound } from 'next/navigation'

export async function deleteUser(id: string) {
  const isAuthenticated = await isAuthAdmin()
  if (!isAuthenticated) return
  const user = await db.user.delete({
    where: { id },
  })

  if (user == null) return notFound()

  return user
}

export async function getAllUsers() {
  const isAuthenticated = await isAuthAdmin()
  if (!isAuthenticated) return
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
