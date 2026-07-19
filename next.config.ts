import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ujtcfpebuknvosklprlr.supabase.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "54321",
      },
    ],
  },
};

export default nextConfig;
