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
      {
        // For Cypress tests
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
}

export default nextConfig
