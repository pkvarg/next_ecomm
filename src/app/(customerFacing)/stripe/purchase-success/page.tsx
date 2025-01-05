import db from '@/db/db'
import { formatCurrency } from '@/lib/formatters'
import { Order as OrderType, ShippingInfo, Product } from '../../../../../types/types'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'
import { CardDescription, CardTitle } from '@/components/ui/card'
import ResetStoreButton from '@/components/ResetStoreButton'
import { updateOrderToPaid } from '@/actions/orders'

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

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string }
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent)

  if (paymentIntent.metadata.orderId == null) return notFound()

  const orderDB = await db.order.findUnique({
    where: { id: paymentIntent.metadata.orderId },
  })

  if (orderDB == null) return notFound()

  // Validate and convert shippingInfo
  const shippingInfo: ShippingInfo | null = isShippingInfo(orderDB.shippingInfo)
    ? orderDB.shippingInfo
    : null

  if (!shippingInfo) {
    return <div>Invalid shipping information</div>
  }

  // Validate and convert products
  const products: Product[] = isProductArray(orderDB.products) ? orderDB.products : []

  // Explicitly cast after validation
  const order: OrderType = {
    ...orderDB,
    shippingInfo: shippingInfo, // Cast shippingInfo to ShippingInfo
    products, // Cast products to Product[]
    paidAt: orderDB?.paidAt || undefined,
    sentAt: orderDB?.sentAt || undefined,
  }

  // Handle payment success
  const isSuccess = paymentIntent.status === 'succeeded'

  if (isSuccess) {
    await updateOrderToPaid(paymentIntent.metadata.orderId)
  }

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? 'Success, Your order has been paid!' : 'Error!'}
      </h1>

      <div className="w-[65%]">
        <h1>Your order: {order.orderNumber} </h1>
        <div className="flex flex-col gap-1 mt-4">
          <h2 className="font-bold">Shipping Info:</h2>
          <p>{order.shippingInfo.name}</p>
          <p>
            {order.shippingInfo.street} {order.shippingInfo.house_number}
          </p>
          <p>{order.shippingInfo.zip}</p>
          <p>{order.shippingInfo.city}</p>
          <p>{order.shippingInfo.country}</p>
          <p>{order.shippingInfo.phone}</p>
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <h2 className="font-bold">Billing Info:</h2>

          <p>{order.shippingInfo.billing_name || order.shippingInfo.name}</p>
          <p>
            {order.shippingInfo.billing_street || order.shippingInfo.street}{' '}
            {order.shippingInfo.billing_house_number || order.shippingInfo.house_number}
          </p>
          <p>{order.shippingInfo.billing_zip || order.shippingInfo.zip}</p>
          <p>{order.shippingInfo.billing_city || order.shippingInfo.city}</p>
          <p>{order.shippingInfo.billing_country || order.shippingInfo.country}</p>
          {order.shippingInfo.billing_ico && (
            <>
              <p>IČO {order.shippingInfo.billing_ico}</p>
              <p>DIČ {order.shippingInfo.billing_dic}</p>
              <p>IČ DPH {order.shippingInfo.billing_ico_dph}</p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <h2 className="font-bold capitalize">
            Payment Method: {order.shippingInfo.payment_type}
          </h2>
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <h2 className="font-bold">Products:</h2>
          {order.products.map((item) => (
            <div key={item.id} className="flex overflow-hidden flex-row my-8">
              <div className="relative m-2">
                <Image
                  src={item.imagePath || '/products/dummy_prod.webp'}
                  width={50}
                  height={50}
                  alt={item.name}
                  priority
                  className="w-auto h-auto"
                />
              </div>

              <div className="flex flex-col mt-2">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>
                  <span className="line-clamp-4 text-justify max-w-[100%]">{item.description}</span>
                  {formatCurrency(item.priceInCents / 100)} x {item.qty} =
                  {formatCurrency((item.priceInCents / 100) * item.qty)}
                </CardDescription>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ResetStoreButton />
    </div>
  )
}
