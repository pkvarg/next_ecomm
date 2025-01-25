import Footer from '@/components/footer'
import { Nav, NavLink } from '@/components/Nav'

export const dynamic = 'force-dynamic'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/my-orders">My Orders</NavLink>
        <NavLink href="/my-downloads">My Downloads</NavLink>
      </Nav>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow container my-6">{children}</div>
        <Footer />
      </div>
    </>
  )
}
