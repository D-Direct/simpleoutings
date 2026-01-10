import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // @ts-expect-error - proper type suppression
    allowedDevOrigins: [
      "localhost:3000",
      "127.0.0.1:3000",
      "192.168.1.17:3000"
    ],
  },
};

export default nextConfig;
