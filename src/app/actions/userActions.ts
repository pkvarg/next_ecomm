'use server'
import db from '@/db/db'
import { clerkClient } from '@clerk/nextjs/server'

export const getUserEmail = async (id: string) => {
  const client = await clerkClient()

  const user = await client.users.getUser(id)
  const userEmail = user.emailAddresses[0].emailAddress

  return userEmail
}

export const logUser = async (email: string) => {
  const existingUser = await db.user.findFirst({
    where: {
      email: email,
    },
  })

  if (!existingUser) {
    const user = await db.user.create({
      data: {
        email: email,
        orders: {
          create: [], // Initialize with an empty array
        },
      },
    })
    return user
  } else {
    const user = await db.user.update({
      where: {
        email: email,
      },
      data: {
        lastLogin: new Date(),
      },
    })
    return user
  }
}

export const updateUserNewsletterSubscription = async (email: string, subscriber: boolean) => {
  await db.user.update({
    where: {
      email: email,
    },
    data: {
      subscriber: subscriber,
    },
  })
}
