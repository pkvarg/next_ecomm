'use client'
import { updatedOrderToCanceled, updateOrderToPaid, updateOrderToSent } from '@/actions/orders'
import { Button } from '@react-email/components'
import React from 'react'
import { useRouter } from 'next/navigation'

interface UpdateOrderButtonProps {
  id: string
  action: string
}

export const UpdateOrderButton: React.FC<UpdateOrderButtonProps> = ({ id, action }) => {
  const router = useRouter()

  const updateOrder = async () => {
    if (action === 'paid') await updateOrderToPaid(id)
    if (action === 'sent') await updateOrderToSent(id)
    if (action === 'cancel') await updatedOrderToCanceled(id)

    router.refresh()
  }

  return (
    <Button
      onClick={updateOrder}
      className={
        action === 'paid'
          ? 'bg-green-600   text-white cursor-pointer'
          : action === 'sent'
          ? 'bg-blue-600  text-white cursor-pointer'
          : 'bg-red-600  text-white cursor-pointer'
      }
    >
      {action === 'paid'
        ? 'Update Order to Paid'
        : action === 'sent'
        ? 'Update Order to Sent'
        : 'Update Order to Canceled'}
    </Button>
  )
}

export default UpdateOrderButton
