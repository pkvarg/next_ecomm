'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps, ReactNode } from 'react'
import { userStore } from '@/store/user'
import { useRouter } from 'next/navigation'

import { IoCartOutline } from 'react-icons/io5'
import useCartStore from '@/store/cartStore'

export function Nav({ children }: { children: ReactNode }) {
  const user = userStore((state: any) => state.user)
  const updateUser = userStore((state: any) => state.updateUser)

  // new cart
  const { items } = useCartStore((state) => state)

  const router = useRouter()

  const goToCart = () => {
    router.push('/cart')
  }

  return (
    <nav className="bg-primary text-primary-foreground flex justify-center px-4 py-3">
      <div>{children}</div>

      <div onClick={goToCart} className="flex flex-row mt-auto ml-auto relative cursor-pointer">
        <IoCartOutline className="text-[25px]" />
        <p className="text-white absolute left-[12.5px] -top-[5px]">
          <span className="px-[5px] bg-red-600 rounded-2xl">{items.length}</span>
        </p>
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
