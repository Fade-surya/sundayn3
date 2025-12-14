import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  allowedDevOrigins: [
    'https://*.replit.dev',
    'https://*.pike.replit.dev',
    'https://*.repl.co'
  ],
};

export default nextConfig;
