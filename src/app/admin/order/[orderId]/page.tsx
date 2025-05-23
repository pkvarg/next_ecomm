import { getOrderById } from '@/actions/orders'
import React from 'react'
import { Order as OrderType, ShippingInfo, Product } from '../../../../../types/types'
import Image from 'next/image'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import UpdateOrderButton from '../../_components/UpdateOrderButton'

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

export default async function Order({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params

  const orderDB = await getOrderById(orderId)

  if (!orderDB) {
    return <div>Order not found</div> // Handle null case
  }
  // Validate and convert shippingInfo
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
    shippingInfo,
    products,
    paidAt: orderDB?.paidAt || undefined,
    sentAt: orderDB?.sentAt || undefined,
    isCancelled: orderDB?.isCancelled,
    orderEmailSent: orderDB?.orderEmailSent,
  }

  return (
    <div className="text-black flex flex-col lg:flex-row mx-2 gap-8 lg:mx-[5%]">
      <div className="w-[65%]">
        <h1 className="font-bold">Your order: {order.orderNumber} </h1>
        {order.isCancelled && (
          <p className="font-bold capitalize text-center text-white bg-red-500">
            Order Cancelled: {order.isCancelled ? `Yes` : 'No'}
          </p>
        )}
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
          <h3 className="font-bold capitalize">
            Payment status:{' '}
            {order.paidAt ? (
              <>
                <span className="bg-green-500 text-white px-2 py-1 rounded mr-1">Paid</span>(
                {order.paidAt.toUTCString()})
              </>
            ) : (
              'Unpaid'
            )}
          </h3>
          <h4 className="font-bold capitalize">
            Order sent:{' '}
            {order.sentAt ? (
              <>
                <span className="bg-green-500 text-white px-2 py-1 rounded mr-1">Sent</span>(
                {order.sentAt.toUTCString()})
              </>
            ) : (
              'Not sent'
            )}
          </h4>
        </div>

        <div className="my-8 flex flex-col gap-2 w-fit">
          {!order.paidAt && <UpdateOrderButton id={orderId} action="paid" />}
          {!order.sentAt && <UpdateOrderButton id={orderId} action="sent" />}
          {!order.isCancelled && <UpdateOrderButton id={orderId} action="cancel" />}
          <p className="font-bold capitalize">
            Order Email sent:{' '}
            {order.orderEmailSent ? (
              <span className="bg-green-400 text-white px-2">Sent</span>
            ) : (
              <span className="bg-red-700 text-white px-2">NO</span>
            )}
          </p>
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
          <div className="font-semibold">
            <p>Products: {formatCurrency(order.productTotalsPrice)}</p>
            <p>Postage: {formatCurrency(order.postage)}</p>
            <p>Tax: {formatCurrency(order.tax)}</p>
            <div className="h-[1px] bg-black"></div>
            <p>Total: {formatCurrency(order.pricePaidInCents / 100)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
