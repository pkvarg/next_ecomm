'use server'

import db from '@/db/db'
import OrderHistoryEmail from '@/email/OrderHistory'
import { Resend } from 'resend'
import { z } from 'zod'
import { Order, Product } from '../../types/types'
import { getOrderNumber } from '@/lib/orderNumber'

const emailSchema = z.string().email()
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function createNewOrder(newOrder: Order) {
  const orderNumber = await getOrderNumber()

  const order = await db.order.create({
    data: {
      orderNumber,
      pricePaidInCents: newOrder.pricePaidInCents,
      productTotalsPrice: newOrder.productTotalsPrice,
      postage: newOrder.postage,
      tax: newOrder.postage,
      userEmail: newOrder.userEmail,
      userInfo: JSON.parse(JSON.stringify(newOrder.userInfo)), // Ensure JSON-compatible
      products: JSON.parse(JSON.stringify(newOrder.products)), // Ensure JSON-compatible
    },
  })

  await updateProductCountInStockAndAvailability(newOrder.products)

  return order.id
}

async function updateProductCountInStockAndAvailability(products: Product[]) {
  for (const product of products) {
    // Fetch the product from the database by its ID
    const prod = await db.product.findUnique({
      where: {
        id: product.id,
      },
    })

    if (!prod) {
      // If product is not found, you may want to log it or handle the case.
      console.log(`Product with id ${product.id} not found.`)
      continue // Skip to the next iteration
    }

    // Calculate the new quantity after subtracting the qty from countInStock
    const newQty = prod.countInStock - product.qty

    const updateData: any = {
      countInStock: newQty, // Set the new countInStock value
    }

    // If newQty is zero, update isAvailableForPurchase to false
    if (newQty === 0) {
      updateData.isAvailableForPurchase = false
    }

    // Update the product's countInStock and possibly isAvailableForPurchase
    await db.product.update({
      where: {
        id: product.id, // Use the product's ID to find the correct product
      },
      data: updateData,
    })
  }
}

export async function getOrderById(id: string) {
  const order = await db.order.findFirst({
    where: {
      id: id,
    },
  })

  return order
}

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData,
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get('email'))

  if (result.success === false) {
    return { error: 'Invalid email address' }
  }

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
    },
  })

  if (user == null) {
    return {
      message: 'Check your email to view your order history and download your products.',
    }
  }

  // const orders = user.orders.map(async (order) => {
  //   return {
  //     ...order,
  //     downloadVerificationId: (
  //       await db.downloadVerification.create({
  //         data: {
  //           expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
  //           productId: order.product.id,
  //         },
  //       })
  //     ).id,
  //   }
  // })

  // const data = await resend.emails.send({
  //   from: `Support <${process.env.SENDER_EMAIL}>`,
  //   to: user.email,
  //   subject: 'Order History',
  //   react: <OrderHistoryEmail orders={await Promise.all(orders)} />,
  // })

  // if (data.error) {
  //   return { error: 'There was an error sending your email. Please try again.' }
  // }

  return {
    message: 'Check your email to view your order history and download your products.',
  }
}
