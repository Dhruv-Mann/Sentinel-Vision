import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Supabase storage images/PDFs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  // Empty turbopack config to satisfy Next.js 16 (Turbopack is default)
  turbopack: {},
  // Required for react-pdf canvas shim in production
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
