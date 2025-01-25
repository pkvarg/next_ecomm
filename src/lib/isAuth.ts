'use server'
import { auth } from '@clerk/nextjs/server'

export async function isAuth() {
  const { userId } = await auth()
  if (!userId) {
    return false
  } else return true
}

export async function isAuthAdmin() {
  const { userId } = await auth()
  const allowed = process.env.ADMIN_CLERK_USER_ID
  if (userId !== allowed) {
    return false
  } else return true
}
