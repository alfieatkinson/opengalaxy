import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.openverse.org',
        port: '',
        pathname: '/v1/images/**',
      },
      {
        protocol: 'https',
        hostname: 'api.openverse.org',
        port: '',
        pathname: '/v1/audio/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
}

export default nextConfig
