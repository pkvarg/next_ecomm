import { Button } from '@/components/ui/button'
import db from '@/db/db'
import { formatCurrency } from '@/lib/formatters'
import { Order as OrderType, ShippingInfo, Product } from '../../../../../types/types'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'
import { CardDescription, CardTitle } from '@/components/ui/card'
import ResetStoreButton from '@/components/ResetStoreButton'

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

  // Validate and convert userInfo
  const shippingInfo: ShippingInfo | null = isShippingInfo(orderDB.userInfo)
    ? orderDB.userInfo
    : null

  if (!shippingInfo) {
    return <div>Invalid shipping information</div>
  }

  // Validate and convert products
  const products: Product[] = isProductArray(orderDB.products) ? orderDB.products : []

  // Explicitly cast after validation
  const order: OrderType = {
    ...orderDB,
    userInfo: shippingInfo, // Cast userInfo to ShippingInfo
    products, // Cast products to Product[]
  }

  // Handle payment success
  const isSuccess = paymentIntent.status === 'succeeded'

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? 'Success, Your order has been paid!' : 'Error!'}
      </h1>
      {/* <div className='flex gap-4 items-center'>
        <div className='aspect-video flex-shrink-0 w-1/3 relative'>
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className='object-cover'
          />
        </div>
        <div>
          <div className='text-lg'>
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          <div className='line-clamp-3 text-muted-foreground'>
            {product.description}
          </div>
          <Button className='mt-4' size='lg' asChild>
            {isSuccess ? (
              <a
                href={`/products/download/${await createDownloadVerification(
                  product.id
                )}`}
              >
                Download
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div> */}
      <div className="w-[65%]">
        <h1>Your order: {order.orderNumber} </h1>
        <div className="flex flex-col gap-1 mt-4">
          <h2 className="font-bold">Shipping Info:</h2>

          <p>{order.userInfo.name}</p>
          <p>
            {order.userInfo.street} {order.userInfo.house_number}
          </p>
          <p>{order.userInfo.zip}</p>
          <p>{order.userInfo.city}</p>
          <p>{order.userInfo.country}</p>
          <p>{order.userInfo.phone}</p>
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <h2 className="font-bold">Billing Info:</h2>

          <p>{order.userInfo.billing_name || order.userInfo.name}</p>
          <p>
            {order.userInfo.billing_street || order.userInfo.street}{' '}
            {order.userInfo.billing_house_number || order.userInfo.house_number}
          </p>
          <p>{order.userInfo.billing_zip || order.userInfo.zip}</p>
          <p>{order.userInfo.billing_city || order.userInfo.city}</p>
          <p>{order.userInfo.billing_country || order.userInfo.country}</p>
          {order.userInfo.billing_ico && (
            <>
              <p>IČO {order.userInfo.billing_ico}</p>
              <p>DIČ {order.userInfo.billing_dic}</p>
              <p>IČ DPH {order.userInfo.billing_ico_dph}</p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <h2 className="font-bold capitalize">Payment Method: {order.userInfo.payment_type}</h2>
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

// async function createDownloadVerification(productId: string) {
//   return (
//     await db.downloadVerification.create({
//       data: {
//         productId,
//         expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
//       },
//     })
//   ).id
// }
