'use server'
import db from '@/db/db'
import { date } from 'zod'

export async function updateVisitors() {
  console.log('here')
  const visitor = await db.visitorsCount.findUnique({
    where: {
      id: '6830d9ff8e1d4d4b5b461e2b',
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
