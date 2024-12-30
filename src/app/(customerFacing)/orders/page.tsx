'use client'

import { userOrders } from '@/app/actions/userActions'
import { emailOrderHistory } from './../../../actions/orders'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState, useFormStatus } from 'react-dom'
import { userEmail } from '@/lib/saveUserEmail'
import { useEffect, useState } from 'react'
import { JsonValue } from '@prisma/client/runtime/library'
import { FileVideo } from 'lucide-react'
import { Order } from '@prisma/client'

export default function MyOrdersPage() {
  const [data, action] = useFormState(emailOrderHistory, {})
  const [myOrders, setMyOrders] = useState<JsonValue[] | null>([])
  const email = userEmail()!

  useEffect(() => {
    const getMyOrder = async () => {
      const orders = await userOrders(email)
      if (orders) {
        const serializedOrders: JsonValue[] = orders.map((order) =>
          JSON.parse(JSON.stringify(order)),
        )

        // Use functional update to ensure logging happens after state is set
        setMyOrders(() => {
          console.log('Updated orders:', serializedOrders)
          return serializedOrders
        })
      }
    }
    getMyOrder()
  }, [email])

  return (
    <form action={action} className="max-2-xl mx-auto">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>My Orders {myOrders?.length}</CardTitle>
          </CardHeader>
          <CardContent>
            {myOrders?.map((order: any) => (
              <div key={order.id}>
                <h1>{order.orderNumber}</h1>
                <p>{order.createdAt}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            Enter your email and we will email you your order history and download links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" required name="email" id="email" />
            {data.error && <div className="text-destructive">{data.error}</div>}
          </div>
        </CardContent>
        <CardFooter>{data.message ? <p>{data.message}</p> : <SubmitButton />}</CardFooter>
      </Card>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button className="w-full" size="lg" disabled={pending} type="submit">
      {pending ? 'Sending...' : 'Send'}
    </Button>
  )
}
