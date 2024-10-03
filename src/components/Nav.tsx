'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps, ReactNode } from 'react'
import { userStore } from '@/store/user'

export function Nav({ children }: { children: ReactNode }) {
  const user = userStore((state: any) => state.user)
  const updateUser = userStore((state: any) => state.updateUser)

  // upon state change call some function
  const sub = userStore.subscribe(() => {
    // trigger some function
  })

  sub()

  return (
    <nav className='bg-primary text-primary-foreground flex justify-center px-4'>
      {children}
      <p className='ml-auto '>{user.full_name}</p>
      <input
        className='border ml-2 h-[40px] text-black'
        type='text'
        onChange={(e: any) => {
          updateUser({
            full_name: e.target.value,
          })
        }}
      />
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
        pathname === props.href && 'bg-background text-foreground'
      )}
    />
  )
}
