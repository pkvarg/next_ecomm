'use server'

import db from '@/db/db'

export async function userOrderExists(email: string, productId: string) {
  /// DEAL WITH ONE PROD from array.... later
  return (
    (await db.order.findFirst({
      where: { user: { email } },
      //where: { user: { email }, productId },
      select: { id: true },
    })) != null
  )
}
