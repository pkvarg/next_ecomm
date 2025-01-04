const CURRENCY_FORMATTER = new Intl.NumberFormat('sk-SK', {
  currency: 'EUR',
  style: 'currency',
  minimumFractionDigits: 2,
})

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}

export const formatDate = (orderDate: string) => {
  const date = new Date(orderDate)

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0') // Ensure 2 digits for the day
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed (0 = January)
  const year = date.getFullYear()

  // Format as DD.MM.YYYY
  return `${day}.${month}.${year}`
}
