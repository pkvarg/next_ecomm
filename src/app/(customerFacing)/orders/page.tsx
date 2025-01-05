'use client'
import { getOrderByUserId } from './../../../actions/orders'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useUserStore from '@/store/userStore'
import { useEffect, useState } from 'react'
import { JsonValue } from '@prisma/client/runtime/library'
import { formatCurrency, formatDate } from '@/lib/formatters'
import Image from 'next/image'

export default function MyOrdersPage() {
  const [myOrders, setMyOrders] = useState<JsonValue[] | null>([])
  const { email, id: userId } = useUserStore()

  useEffect(() => {
    const getMyOrder = async () => {
      const orders = await getOrderByUserId(userId)
      if (orders) {
        const serializedOrders: JsonValue[] = orders.map((order) =>
          JSON.parse(JSON.stringify(order)),
        )
        // Use functional update to ensure logging happens after state is set
        setMyOrders(() => {
          return serializedOrders
        })
      }
    }
    getMyOrder()
  }, [email, userId])

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>My Orders {myOrders?.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {myOrders?.map((order: any) => (
            <div key={order.id}>
              <h1 className="font-bold mt-8">Order Number {order.orderNumber}</h1>
              <p>Date {formatDate(order.createdAt)}</p>
              <div className="flex flex-col gap-1 mt-4">
                <h2 className="font-bold">Products:</h2>
                {order.products.map((item: any) => (
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
                        <span className="line-clamp-4 text-justify max-w-[100%]">
                          {item.description}
                        </span>
                        {formatCurrency(item.priceInCents / 100)} x {item.qty} =
                        {formatCurrency((item.priceInCents / 100) * item.qty)}
                      </CardDescription>
                    </div>
                  </div>
                ))}
              </div>
              <div className="font-bold">
                <h1>Totals:</h1>
                <p>Products: {formatCurrency(order.productTotalsPrice)}</p>
                <p>Postage: {formatCurrency(order.postage)}</p>
                <p>Tax: {formatCurrency(order.tax)}</p>

                <p>Total: {formatCurrency(order.pricePaidInCents / 100)}</p>
              </div>
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
              <div className="h-[1.5px] bg-black mt-8"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
