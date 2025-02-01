'use server'

import { z } from 'zod'
import { Order } from '../../types/types'
import { isAuth } from '@/lib/isAuth'

const EmailSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  message: z.string(),
})

export async function contactEmail(email: unknown) {
  EmailSchema.safeParse(email)

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

export async function sendOrderWithPdf(order: Order, pdfBase64: string) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return

  try {
    if (!order.userEmail || !pdfBase64) {
      return { error: 'Email or PDF is missing' }
    }

    // Make the API call using fetch
    const response = await fetch('http://localhost:3011/email/next_eshop/mailer', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
        origin: process.env.NEXT_ORIGIN,
        pdf: pdfBase64,
        email: '',
        action: 'newOrder',
      }),
    })

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error in API call:', errorData)

      return { success: false, message: errorData.message }
    }

    // Parse successful response
    const data = await response.json()
    console.log('API call successful:', data)

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)

    // Handle unexpected errors
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function lowProductCount(product: string, name: string, newQty: string) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return
  try {
    // Make the API call using fetch
    const response = await fetch('http://localhost:3011/email/next_eshop/mailer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: [],
        origin: process.env.NEXT_ORIGIN,
        pdf: newQty, // to reuse eshopMailer function on server
        email: product + '  ' + name, // to reuse eshopMailer function on server
        action: 'lowProductCount',
      }),
    })

    const { status } = await response.json()

    if (status) return status
  } catch (err) {
    console.log('error', err)
  }
}

export async function orderPaidByStripe(order: Order) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return
  try {
    // Make the API call using fetch
    const response = await fetch('http://localhost:3011/email/next_eshop/mailer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
        origin: process.env.NEXT_ORIGIN,
        pdf: '',
        email: '',
        action: 'paidByStripe',
      }),
    })

    const { status } = await response.json()

    if (status) return status
  } catch (err) {
    console.log('error', err)
  }
}

// will not
export async function orderStripeError(product: string, name: string, newQty: string) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return
}

// not yet
export async function orderPackedAndSent(order: Order) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return

  try {
    // Make the API call using fetch
    const response = await fetch('http://localhost:3011/email/next_eshop/mailer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
        origin: process.env.NEXT_ORIGIN,
        pdf: '',
        email: '',
        action: 'orderPackedAndSent',
      }),
    })

    const { status } = await response.json()

    if (status) return status
  } catch (err) {
    console.log('error', err)
  }
}
