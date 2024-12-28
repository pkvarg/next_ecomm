import db from '@/db/db'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'
import { CheckoutForm } from '../../products/[id]/purchase/_components/CheckoutForm'
import { getOrderById } from '@/actions/orders'
import { Order as OrderType, ShippingInfo, Product } from '../../../../../types/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

// Type guard to ensure JsonValue is ShippingInfo
function isShippingInfo(value: any): value is ShippingInfo {
  return value && typeof value === 'object' && 'zip' in value && 'city' in value && 'phone' in value
}

// Type guard to ensure JsonValue is Product[]
function isProductArray(value: any): value is Product[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        'id' in item &&
        'name' in item &&
        'qty' in item &&
        'priceInCents' in item,
    )
  )
}

export default async function PurchasePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const orderDB = await getOrderById(orderId)

  if (!orderDB) {
    return <div>Order not found</div> // Handle null case
  }

  // Validate and convert userInfo
  const shippingInfo: ShippingInfo | null = isShippingInfo(orderDB.userInfo)
    ? orderDB.userInfo
    : null

  // Validate and convert products
  const products: Product[] = isProductArray(orderDB.products) ? orderDB.products : []

  if (!shippingInfo) {
    return <div>Invalid shipping information</div>
  }

  const order: OrderType = {
    ...orderDB,
    userInfo: shippingInfo,
    products,
  }

  console.log('stripe', order.pricePaidInCents)

  const payproduct = {
    id: '001',
    //priceInCents: 1000,
    priceInCents: order.pricePaidInCents,
    name: 'this prod',
    imagePath: '/products/6b19365d-9f5b-4097-bb5f-cdae451b6010-server.png',
    description: 'test prod',
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.pricePaidInCents,
    currency: 'EUR',
    metadata: { orderId: orderId },
  })

  if (paymentIntent.client_secret == null) {
    throw Error('Stripe failed to create payment intent')
  }

  return (
    <CheckoutForm
      order={{
        ...order,
        //description: order.orderNumber || '', // Provide fallback value if description is null
      }}
      clientSecret={paymentIntent.client_secret}
    />
  )

  // Calculate total price
  // const totalPriceInCents = order.pricePaidInCents

  // // Create payment intent with dynamic order data
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: totalPriceInCents,
  //   currency: 'EUR',
  //   metadata: {
  //     orderId: order.id!,
  //     productNames: products.map((p) => p.name).join(', '),
  //   },
  // })

  // if (paymentIntent.client_secret == null) {
  //   throw Error('Stripe failed to create payment intent')
  // }

  // return (
  //   <CheckoutForm
  //     product={{
  //       id: orderId,
  //       name: 'Order Payment',
  //       priceInCents: totalPriceInCents,
  //       description: `Order for ${products.length} items`,
  //       imagePath: '/products/default.png', // Optional: Generic image
  //     }}
  //     clientSecret={paymentIntent.client_secret}
  //   />
  // )
}
