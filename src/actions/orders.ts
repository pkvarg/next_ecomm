'use server'
import db from '@/db/db'
import { Order, Product } from '../../types/types'
import { getOrderNumber } from '@/lib/orderNumber'
import { updateUserNewsletterSubscription } from '@/app/actions/userActions'

export async function createNewOrder(newOrder: Order) {
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

export async function getOrdersByUserId(id: string) {
  const orders = await db.order.findMany({
    where: {
      userId: id,
    },
    orderBy: { createdAt: 'desc' },
  })

  return orders
}

export async function updateOrderToPaid(id: string) {
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
  try {
    await db.order.update({
      where: { id },
      data: {
        sentAt: new Date(),
      },
    })
    return { message: 'Order updated to sent' }
  } catch (error) {
    console.error('Error updating order to sent:', error)
  }
}

export async function updatedOrderToCanceled(id: string) {
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
