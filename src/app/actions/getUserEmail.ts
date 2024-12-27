'use server'

import { clerkClient } from '@clerk/nextjs/server'

export const getUserEmail = async (id: string) => {
  const client = await clerkClient()

  const user = await client.users.getUser(id)
  const userEmail = user.emailAddresses[0].emailAddress

  return userEmail
}
