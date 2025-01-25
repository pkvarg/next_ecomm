'use server'

import { z } from 'zod'

const EmailSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  message: z.string(),
})

export async function contactEmail(email: unknown) {
  EmailSchema.parse(email) // Throws an error if invalid

  const response = await fetch('http://localhost:3011/email/next_eshop/mailer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order: [],
      origin: process.env.NEXT_ORIGIN,
      pdf: '',
      email: email,
      action: 'newContact',
    }),
  })

  const { status } = await response.json()

  if (status) return status
}
