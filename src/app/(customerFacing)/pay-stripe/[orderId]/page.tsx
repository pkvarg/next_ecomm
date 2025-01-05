import Stripe from 'stripe'
import { CheckoutForm } from '@/components/CheckoutForm'
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
  const shippingInfo: ShippingInfo | null = isShippingInfo(orderDB.shippingInfo)
    ? orderDB.shippingInfo
    : null

  // Validate and convert products
  const products: Product[] = isProductArray(orderDB.products) ? orderDB.products : []

  if (!shippingInfo) {
    return <div>Invalid shipping information</div>
  }

  const order: OrderType = {
    ...orderDB,
    shippingInfo: shippingInfo,
    products,
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
      }}
      clientSecret={paymentIntent.client_secret}
    />
  )
}
