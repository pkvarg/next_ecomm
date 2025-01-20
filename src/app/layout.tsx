import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'next_ecommerce',
  description: 'Pictusweb',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorText: 'gray',
        },
      }}
    >
      <html lang="en">
        <body className={cn('bg-background font-sans antialiased', inter.variable)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
