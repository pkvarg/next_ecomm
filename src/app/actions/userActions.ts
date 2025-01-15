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
    // send notif to admin
    try {
      const response = await fetch('http://localhost:3011/email/next_eshop/mailer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: [],
          origin: process.env.NEXT_PUBLIC_ORIGIN,
          pdf: '',
          email,
        }),
      })
      console.log('notif sent', response)
    } catch (err) {
      console.log('err admin notif email', err)
    }

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
