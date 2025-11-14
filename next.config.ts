import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Add output configuration for better compatibility
  output: 'standalone',

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://www.learnityxai.corespace.click/',
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'learnityxai.corespace.click',
      },
      {
        protocol: 'https',
        hostname: 'www.learnityxai.corespace.click', // Add www version
      },
    ],
    // Add this if you're having image optimization issues
    unoptimized: false,
  },

  // Add these for better chunk handling
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      };
    }
    return config;
  },

  // Add compression
  compress: true,

  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
};

export default nextConfig;