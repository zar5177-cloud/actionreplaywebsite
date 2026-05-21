import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
    ],
    qualities: [75],
  },
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
