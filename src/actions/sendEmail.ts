'use server'

import { z } from 'zod'
import { Order } from '../../types/types'
import { isAuth } from '@/lib/isAuth'
//import { getLocale } from 'next-intl/server'

interface SendMailOptions {
  name: string
  email: string
  phone: string
  mailMessage: string
}

const origin = 'NEXTECOMMERCE'

export async function sendMail(options: SendMailOptions) {
  //const locale = await getLocale()
  const locale = 'en'

  const subjectTranslations = {
    en: 'Message from nextecommerce',
    sk: 'Správa z nextecommerce',
  }

  const subject =
    subjectTranslations[locale as keyof typeof subjectTranslations] || subjectTranslations.sk

  try {
    const sendData = {
      ...options,
      locale,
      origin,
      subject,
    }

    // API endpoint - update with your actual API URL
    //const apiUrl = 'http://localhost:3013/api/contact'
    const apiUrl = 'https://hono-api.pictusweb.com/api/contact'

    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendData),
    })

    //Check if request was successful
    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        message: errorData.message || 'Failed to submit form',
      }
    }

    // Return success response
    const data = await response.json()
    //console.log('returned data', data)

    return {
      success: true,
      message: data.message || 'Message sent successfully',
    }
    // const { status } = await response.json()

    // if (status) return status
  } catch (error) {
    // Handle validation errors
    if (error) {
      console.log('error', error)
      return {
        success: false,
        message: error,
      }
    }

    // Handle other errors
    console.error('Contact form submission error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred',
    }
  }
}

export async function sendOrderWithPdf(order: Order, pdfBase64: string) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return

  try {
    if (!order.userEmail || !pdfBase64) {
      return { error: 'Email or PDF is missing' }
    }

    //const apiUrl = 'http://localhost:3013/api/nextecommerce/order'
    const apiUrl = 'https://hono-api.pictusweb.com/api/nextecommerce/order'

    // Make the API call using fetch
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
        origin: origin,
        pdf: pdfBase64,
        email: order.userEmail,
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
    //const apiUrl = 'http://localhost:3013/api/nextecommerce/order'
    const apiUrl = 'https://hono-api.pictusweb.com/api/nextecommerce/order'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: [],
        origin: origin,
        pdf: newQty, // to reuse eshopMailer function on server
        email: product + '  ' + name, // to reuse eshopMailer function on server
        action: 'lowProductCount',
      }),
    })

    const { status } = await response.json()
    console.log('**LOW response', status)

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
    // const apiUrl = 'http://localhost:3013/api/nextecommerce/order'
    const apiUrl = 'https://hono-api.pictusweb.com/api/nextecommerce/order'
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
        origin: origin,
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

export async function orderPackedAndSent(order: Order) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return

  try {
    // Make the API call using fetch
    //const apiUrl = 'http://localhost:3013/api/nextecommerce/order'
    const apiUrl = 'https://hono-api.pictusweb.com/api/nextecommerce/order'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
        origin: origin,
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
