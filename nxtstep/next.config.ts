import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase-admin'],
  // Bypasses TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Bypasses ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
