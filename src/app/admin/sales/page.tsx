import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { formatCurrency } from '@/lib/formatters'
import { PageHeader } from '../_components/PageHeader'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import { DeleteDropDownItem } from './_components/salesActions'

import { getAllOrders } from '../_actions/orders'
import { formatDate } from '@/lib/formatters'
import Link from 'next/link'

export default function UsersPage() {
  return (
    <>
      <PageHeader>Sales</PageHeader>
      <UsersTable />
    </>
  )
}

async function UsersTable() {
  const orders = await getAllOrders()

  if (orders.length === 0) return <p>No orders found</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.userEmail}</TableCell>

            <TableCell>
              <Link href={`/admin/order/${order.id}`}>
                <button className="underline">{order.orderNumber}</button>
              </Link>
            </TableCell>
            <TableCell>{formatCurrency(order.pricePaidInCents)}</TableCell>
            <TableCell>{formatDate(order.createdAt.toISOString())}</TableCell>

            {/* <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropDownItem id={user.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
