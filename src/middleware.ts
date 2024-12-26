import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/shipping', '/admin'])

export default clerkMiddleware(async (auth, req) => {
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
