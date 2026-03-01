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
  // Turbopack is default in Next.js 16
  turbopack: {},
  // canvas alias for react-pdf (webpack / production build only)
  webpack: (config) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config.resolve as any).alias.canvas = false;
    return config;
  },
};

export default nextConfig;
