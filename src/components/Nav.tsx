'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps, ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IoCartOutline } from 'react-icons/io5'
import useCartStore from '@/store/cartStore'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { getUserEmail, log } from '@/app/actions/userActions'
import { saveEmail } from '@/lib/saveUserEmail'

export function Nav({ children }: { children: ReactNode }) {
  const userId = useUser().user?.id

  useEffect(() => {
    if (userId) {
      const userEmail = async () => {
        const email = await getUserEmail(userId)
        await log(email)
        saveEmail(email)
      }
      userEmail()
    }
  }, [userId])

  // new cart
  const { items } = useCartStore((state) => state)

  const router = useRouter()

  const goToCart = () => {
    router.push('/cart')
  }

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-primary text-primary-foreground flex justify-center px-4 relative py-3 md:py-0">
      {/* Desktop View */}
      <div className="hidden md:flex">{children}</div>

      {/* Mobile Menu Button */}
      <div
        className="flex md:hidden items-center cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="text-3xl">☰</div>
      </div>
      {/* <div>{children}</div> */}

      <div className="flex flex-row ml-auto relative cursor-pointer items-center text-white">
        <div className="mr-4">
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton showName />
          </SignedIn>
        </div>
        <div onClick={goToCart}>
          <IoCartOutline className="text-[25px]" />
          <p className="text-white absolute -right-[5px] -top-[5px] md:top-[5px]">
            <span className="px-[5px] bg-red-600 rounded-2xl">{items.length}</span>
          </p>
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-primary shadow-lg md:hidden z-50">
          <div className="flex flex-col space-y-3 p-4">{children}</div>
        </div>
      )}
    </nav>
  )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
  const pathname = usePathname()
  return (
    <Link
      {...props}
      className={cn(
        'p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground',
        pathname === props.href && 'bg-background text-foreground',
      )}
    />
  )
}
