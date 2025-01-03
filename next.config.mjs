/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://next-ecomm-nu.vercel.app',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'ethical-bonefish-42.accounts.dev',
      },
    ],
  },
}

export default nextConfig
