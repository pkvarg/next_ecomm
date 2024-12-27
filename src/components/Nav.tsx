'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { IoCartOutline } from 'react-icons/io5'
import useCartStore from '@/store/cartStore'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { getUserEmail } from '@/app/actions/getUserEmail'
import { saveEmail } from '@/lib/saveUserEmail'

export function Nav({ children }: { children: ReactNode }) {
  const userId = useUser().user?.id

  useEffect(() => {
    if (userId) {
      const userEmail = async () => {
        const email = await getUserEmail(userId)
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

  return (
    <nav className="bg-primary text-primary-foreground flex justify-center px-4 py-3">
      <div>{children}</div>

      <div className="flex flex-row mt-auto ml-auto relative cursor-pointer items-center text-white">
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
          <p className="text-white absolute -right-[5px]  -top-[5px]">
            <span className="px-[5px] bg-red-600 rounded-2xl">{items.length}</span>
          </p>
        </div>

        {/* <p>{user.full_name}</p> */}

        {/* <input
          className='border ml-2 text-black'
          type='text'
          onChange={(e: any) => {
            updateUser({
              full_name: e.target.value,
            })
          }}
        />  */}
      </div>
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
