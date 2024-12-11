/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://next-ecomm-nu.vercel.app',
        pathname: '**',
      },
    ],
  },
}

export default nextConfig
