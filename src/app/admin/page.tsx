import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import db from '@/db/db'
import { formatCurrency, formatNumber } from '@/lib/formatters'

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  })

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  }
}

// async function createVisitor() {
//   console.log('here create')

//   await db.visitorsCount.create({
//     data: {
//       count: 1,
//       updatedAt: new Date(),
//     },
//   })
// }

async function getVisitorsData() {
  const visitor = await db.visitorsCount.findUnique({
    where: {
      id: '6830d9ff8e1d4d4b5b461e2b',
    },
  })
  return visitor?.count
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ])

  return {
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  }
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ])

  return { activeCount, inactiveCount }
}

export default async function AdminDashboard() {
  const [salesData, visitorsData, userData, productData] = await Promise.all([
    getSalesData(),
    getVisitorsData(),
    //createVisitor(),
    getUserData(),
    getProductData(),
  ])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard title="Visitors" subtitle={''} body={visitorsData!.toString()} />
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(userData?.averageValuePerUser)} Average Value`}
        body={formatNumber(userData?.userCount)}
      />
      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(productData?.inactiveCount)} Inactive`}
        body={formatNumber(productData?.activeCount)}
      />
    </div>
  )
}

type DashboardCardProps = {
  title: string
  subtitle: string
  body: string
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  )
}
