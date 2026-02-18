/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable App Router (Next.js 13+)
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["ui-avatars.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Enable SWC minification
  swcMinify: true,
  // Configure API routes
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
