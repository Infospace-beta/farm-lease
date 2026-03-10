import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve optimised images from any remote host (avatars, profile pictures)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  // Keep HTTP connections alive to the same backend — reduces per-request latency
  httpAgentOptions: { keepAlive: true },
  // Compress responses
  compress: true,
  // Optimize JavaScript bundles
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  // Optimize production build
  productionBrowserSourceMaps: false,
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons", "recharts"],
  },
  // Redirect common typos
  async redirects() {
    return [
      {
        source: "/leasee/:path*",
        destination: "/lessee/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
