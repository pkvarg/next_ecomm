'use server'
import db from '@/db/db'
import { date } from 'zod'

export async function updateVisitors() {
  console.log('here')
  const visitor = await db.visitorsCount.findUnique({
    where: {
      id: 'e54f0eb9-79ec-4359-820a-7df4c5f6906e',
    },
  })

  console.log('here visitor', visitor)

  if (!visitor) return

  const countInDB = visitor.count

  await db.visitorsCount.update({
    where: {
      id: visitor.id,
    },
    data: {
      count: countInDB + 1,
    },
  })
}
