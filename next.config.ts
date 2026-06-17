import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://172.17.2.50:3000"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
