import db from '@/db/db'

// Define return type explicitly (string)
export const getOrderNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear()

  // Find the first unused cancelled order number for this year
  const cancelledOrder = await db.order.findFirst({
    where: {
      createdAt: {
        gte: new Date(currentYear, 0, 1), // Greater than or equal to start of year
      },
      isCancelled: true,
      isCancelledOrderNumberUsed: false,
    },
    orderBy: {
      orderNumber: 'asc', // Sort by orderNumber ascending
    },
  })

  if (cancelledOrder) {
    // Update the cancelled order directly in the database
    const updatedOrder = await db.order.update({
      where: { id: cancelledOrder.id },
      data: {
        isCancelledOrderNumberUsed: true,
      },
    })

    return updatedOrder.orderNumber.toString() // Return as is, without 'W'
  }

  // Find the highest order number for this year
  const highestOrder = await db.order.findFirst({
    where: {
      createdAt: {
        gte: new Date(currentYear, 0, 1), // Orders created from start of the year
      },
    },
    orderBy: {
      orderNumber: 'desc', // Sort by orderNumber descending
    },
  })

  let newOrderNumber: number
  if (highestOrder) {
    // Extract the numeric part (remove year prefix and 'W' suffix)
    const highestNumber = parseInt(highestOrder.orderNumber.toString().slice(4, -1))
    newOrderNumber = currentYear * 10000 + highestNumber + 1
  } else {
    newOrderNumber = currentYear * 10000 + 1
  }

  return formatOrderNumber(newOrderNumber)
}

// Type the formatOrderNumber function
function formatOrderNumber(number: number): string {
  return `${number}W`
}

// Utility to add leading zeros (optional but useful)
function addLeadingZeros(num: number, totalLength: number): string {
  return String(num).padStart(totalLength, '0')
}
