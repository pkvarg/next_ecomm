'use server'
import db from '@/db/db'
import { Order, Product } from '../../types/types'

import { getOrderNumber } from '@/lib/orderNumber'
import { updateUserNewsletterSubscription } from '@/app/actions/userActions'
import { isAuth, isAuthAdmin } from '@/lib/isAuth'
import { lowProductCount, orderPackedAndSent } from './sendEmail'

function transformOrder(input: any): Order {
  return {
    id: input.id,
    orderNumber: input.orderNumber,
    pricePaidInCents: input.pricePaidInCents,
    productTotalsPrice: input.productTotalsPrice * 100, // Assuming it needs conversion to cents
    postage: input.postage * 100, // Assuming cents conversion
    tax: Math.round(input.tax * 100), // Convert tax to cents and round
    createdAt: new Date(input.createdAt),
    updatedAt: new Date(input.updatedAt),
    userId: input.userId,
    userEmail: input.userEmail,
    newsletter: input.newsletter,
    isCancelled: input.isCancelled,
    orderEmailSent: input.orderEmailSent,
    paidAt: input.paidAt ? new Date(input.paidAt) : undefined,
    sentAt: input.sentAt ? new Date(input.sentAt) : undefined,
    shippingInfo: {
      name: input.shippingInfo.name,
      street: input.shippingInfo.street,
      house_number: input.shippingInfo.house_number,
      city: input.shippingInfo.city,
      zip: input.shippingInfo.zip,
      country: input.shippingInfo.country,
      phone: input.shippingInfo.phone,
      note: input.shippingInfo.note,
      is_billing_address: input.shippingInfo.is_billing_address,
      billing_name: input.shippingInfo.billing_name,
      billing_street: input.shippingInfo.billing_street,
      billing_house_number: input.shippingInfo.billing_house_number,
      billing_city: input.shippingInfo.billing_city,
      billing_zip: input.shippingInfo.billing_zip,
      billing_country: input.shippingInfo.billing_country,
      billing_ico: input.shippingInfo.billing_ico,
      billing_dic: input.shippingInfo.billing_dic,
      billing_ico_dph: input.shippingInfo.billing_ico_dph,
      is_ico_dic: input.shippingInfo.is_ico_dic,
      payment_type: input.shippingInfo.payment_type,
      cash: input.shippingInfo.cash,
      stripe: input.shippingInfo.stripe,
      bank: input.shippingInfo.bank,
    },
    products: input.products.map((product: any) => ({
      id: product.id,
      name: product.name,
      priceInCents: product.priceInCents,
      filePath: product.filePath ?? undefined,
      imagePath: product.imagePath,
      description: product.description ?? undefined,
      isAvailableForPurchase: product.isAvailableForPurchase ?? undefined,
      createdAt: new Date(), // Assuming current date as createdAt is missing
      updatedAt: new Date(), // Assuming current date as updatedAt is missing
      qty: product.qty,
      countInStock: product.countInStock,
      downloadVerifications: [],
    })),
  }
}

export async function createNewOrder(newOrder: Order) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return
  const orderNumber = await getOrderNumber()
  const subscriber = newOrder.newsletter
  // User check if subscriber and update
  // User add order to order array

  const order = await db.order.create({
    data: {
      orderNumber,
      pricePaidInCents: newOrder.pricePaidInCents,
      productTotalsPrice: newOrder.productTotalsPrice,
      postage: newOrder.postage,
      tax: newOrder.tax,
      userEmail: newOrder.userEmail,
      shippingInfo: JSON.parse(JSON.stringify(newOrder.shippingInfo)), // Ensure JSON-compatible
      user: {
        connect: { id: newOrder.userId }, // Connect to the user placing the order
      },
      newsletter: subscriber,
      products: newOrder.products.map((product) => ({
        id: product.id,
        name: product.name,
        priceInCents: product.priceInCents,
        filePath: product.filePath,
        imagePath: product.imagePath,
        description: product.description,
        isAvailableForPurchase: product.isAvailableForPurchase,
        countInStock: product.countInStock,
        qty: product.qty,
      })),
    },
  })

  await updateProductCountInStockAndAvailability(newOrder.products)
  await updateUserNewsletterSubscription(newOrder.userEmail, subscriber)

  return order
}

async function updateProductCountInStockAndAvailability(products: Product[]) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return
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

    if (newQty <= 10) {
      try {
        await lowProductCount(prod.name, prod.id, newQty.toString())
      } catch (error) {
        console.log('low prod count send email error', error)
      }
    }

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
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return
  const order = await db.order.findFirst({
    where: {
      id: id,
    },
  })

  return order
}

export async function getOrdersByUserId(id: string) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return
  const orders = await db.order.findMany({
    where: {
      userId: id,
    },
    orderBy: { createdAt: 'desc' },
  })

  return orders
}

export async function updateOrderToPaid(id: string) {
  // do with Stripe also
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return
  try {
    await db.order.update({
      where: { id },
      data: {
        paidAt: new Date(),
      },
    })
    return { message: 'Order updated to paid' }
  } catch (error) {
    console.error('Error updating order to paid:', error)
  }
}

export async function updateOrderToSent(id: string) {
  const isAuthenticated = await isAuthAdmin()
  if (!isAuthenticated) return
  try {
    // TEMP OFF

    await db.order.update({
      where: { id },
      data: {
        sentAt: new Date(),
      },
    })
    // get the updated order
    const orderDB = await db.order.findFirst({
      where: {
        id: id,
      },
    })

    // send email
    if (orderDB) {
      const order: Order = transformOrder(orderDB)
      await orderPackedAndSent(order)
    }

    return { message: 'Order updated to sent' }
  } catch (error) {
    console.error('Error updating order to sent:', error)
  }
}

export async function updatedOrderToCanceled(id: string) {
  const isAuthenticated = await isAuthAdmin()
  if (!isAuthenticated) return
  try {
    await db.order.update({
      where: { id },
      data: {
        isCancelled: true,
      },
    })
    return { message: 'Order updated to canceled' }
  } catch (error) {
    console.error('Error updating order to canceled:', error)
  }
}

export async function updateOrderToOrderEmailSent(id: string) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return
  try {
    await db.order.update({
      where: { id },
      data: {
        orderEmailSent: true,
      },
    })
    return { message: 'Order email updated to sent' }
  } catch (error) {
    console.error('Error updating order email to sent:', error)
  }
}

export async function getOrderEmailSentStatus(id: string) {
  const isAuthenticated = await isAuth()
  if (!isAuthenticated) return
  const order = await db.order.findFirst({
    where: {
      id: id,
    },
  })

  return order?.orderEmailSent
}
