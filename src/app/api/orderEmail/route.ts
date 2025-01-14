import { NextRequest } from 'next/server'

const origin = process.env.NEXT_PUBLIC_ORIGIN

export async function POST(req: NextRequest) {
  try {
    //const { name, email, phone, mailMessage, locale, origin } = await req.json()
    const { order, pdfBase64 } = await req.json()

    if (!order.userEmail || !pdfBase64) {
      return new Response(JSON.stringify({ error: 'Email or PDF is missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Make the API call using fetch
    const response = await fetch('http://localhost:3011/email/next_eshop/mailer', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
        origin,
        pdf: pdfBase64,
      }),
    })

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error in API call:', errorData)

      return new Response(
        JSON.stringify({ success: false, message: errorData.message || 'API call failed' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Parse successful response
    const data = await response.json()
    console.log('API call successful:', data)

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Unexpected error:', error)

    // Handle unexpected errors
    return new Response(
      JSON.stringify({ success: false, message: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
