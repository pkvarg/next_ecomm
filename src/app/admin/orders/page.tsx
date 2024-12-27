import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import db from '@/db/db'
import { formatCurrency } from '@/lib/formatters'
import { PageHeader } from '../_components/PageHeader'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import { DeleteDropDownItem } from './_components/OrderActions'
import { Order, Product } from '../../../../types/types'

function getOrders() {
  return db.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      productTotalsPrice: true,
      postage: true,
      tax: true,
      createdAt: true,
      updatedAt: true,
      userEmail: true,
      userInfo: true,
      products: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default function OrdersPage() {
  return (
    <>
      <PageHeader>Sales</PageHeader>
      <OrdersTable />
    </>
  )
}

async function OrdersTable() {
  const orders = await getOrders()

  if (orders.length === 0) return <p>No sales found</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price Paid</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            {/* <TableCell>{order.products[0].name}</TableCell> */}
            {(order.products as []).map((product: Product) => (
              <TableCell key={product.id}>
                {product.name} x {product.qty}
              </TableCell>
            ))}
            {/* {order.products?.map((product: Product) => (
              <TableCell key={product?.id}>{product.name}</TableCell>
            ))} */}

            <TableCell>incl email</TableCell>
            {/* <TableCell>{order.userInfo.email}</TableCell> */}
            <TableCell>{formatCurrency(order.pricePaidInCents / 100)}</TableCell>
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropDownItem id={order.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
