import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve optimised images from any remote host (avatars, profile pictures)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  // Keep HTTP connections alive to the same backend — reduces per-request latency
  httpAgentOptions: { keepAlive: true },
  // Compress responses
  compress: true,
};

export default nextConfig;
