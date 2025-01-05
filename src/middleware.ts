import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/shipping',
  '/orders',
  /^\/order(\/.*)?$/,
  '/payment-type',
  '/place-order',
  '/my-orders',
  '/my-downloads',
  /^\/pay-stripe(\/.*)?$/,
  /^\/stripe(\/.*)?$/,
  /^\/admin(\/.*)?$/,
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  const client = await clerkClient()

  if (userId) {
    const user = await client.users.getUser(userId)
  }

  if (isProtectedRoute(req)) {
    // Protect the route

    await auth.protect()

    // Check if the route is '/admin' and restrict access to a specific userl
    if (req.nextUrl.pathname === '/admin') {
      const { userId } = await auth()

      const allowed = process.env.ADMIN_CLERK_USER_ID

      if (userId !== allowed) {
        // If the user is not authorized, return a 403 Forbidden response
        return new Response('Forbidden', { status: 403 })
      }
    }
  }
})
