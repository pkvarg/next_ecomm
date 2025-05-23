import { PrismaClient } from '../../prisma/generated/prisma'

const db = new PrismaClient({
  //log: ['query', 'info', 'warn', 'error'],
  log: ['error'],
})

export default db
