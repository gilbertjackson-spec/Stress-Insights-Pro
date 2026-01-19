import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // @ts-ignore - allowedDevOrigins might not be in the local types but is valid for Next 15
    allowedDevOrigins: [
      "9000-firebase-studio-1763106864880.cluster-f73ibkkuije66wssuontdtbx6q.cloudworkstations.dev",
      "9003-firebase-studio-1763106864880.cluster-f73ibkkuije66wssuontdtbx6q.cloudworkstations.dev"
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
