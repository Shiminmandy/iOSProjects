import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // 使用新的 remotePatterns 配置方式（推荐）
    // Use new remotePatterns configuration (recommended)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        // 可选：限制路径
        // Optional: restrict paths
        // pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
