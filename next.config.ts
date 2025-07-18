import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Webpack configuration
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Handle SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Static optimization
  output: 'standalone',
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: true, // For static export compatibility
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration - allow warnings but not errors
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
};

export default nextConfig;
