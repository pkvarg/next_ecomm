import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/shipping', '/admin'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  const client = await clerkClient()

  if (userId) {
    const user = await client.users.getUser(userId)
    const userEmail = user.emailAddresses[0].emailAddress

    // save to client side not here
    // make API call from Nav and shipping screen where clerkClient will be used

    // const existingEmail = localStorage.getItem('userEmail')

    // if (existingEmail) {
    //   // If exists, remove it
    //   localStorage.removeItem('userEmail')
    //   console.log('Old email removed:', existingEmail)
    // }

    // // Save new email
    // localStorage.setItem('userEmail', userEmail)
    // console.log('New email saved:', userEmail)
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
