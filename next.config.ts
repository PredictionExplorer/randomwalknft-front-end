import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomwalknft.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
