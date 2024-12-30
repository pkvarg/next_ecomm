'use server'

import db from '@/db/db'
import { clerkClient } from '@clerk/nextjs/server'
//import { Order } from '../../../types/types'
import { Order } from '@prisma/client'
import { Prisma } from '@prisma/client'

export const getUserEmail = async (id: string) => {
  const client = await clerkClient()

  const user = await client.users.getUser(id)
  const userEmail = user.emailAddresses[0].emailAddress

  return userEmail
}

export const log = async (email: string) => {
  await db.log.create({
    data: {
      email,
    },
  })
}

export const userActivity = async (newOrder: Order) => {
  const existingUser = await db.user.findFirst({
    where: {
      email: newOrder.userEmail,
    },
  })

  // Transform newOrder into a plain JSON object
  const serializedOrder = JSON.parse(JSON.stringify(newOrder))

  if (!existingUser) {
    await db.user.create({
      data: {
        email: newOrder.userEmail,
        orders: [serializedOrder] as Prisma.InputJsonValue[],
        subscriber: newOrder.newsletter,
      },
    })
  } else {
    const updatedOrders = [
      ...((existingUser.orders as Prisma.JsonArray) || []), // Ensure existing orders are treated as an array
      serializedOrder, // Append serialized order
    ]

    await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        orders: updatedOrders as Prisma.InputJsonValue[], // Ensure Prisma accepts the updated array
        subscriber: newOrder.newsletter,
      },
    })
  }
}

export const userOrders = async (email: string) => {
  const user = await db.user.findFirst({
    where: {
      email,
    },
  })
  if (user) return user.orders
}
