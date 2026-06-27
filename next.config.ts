import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  images: {
    remotePatterns: [
      { hostname: "*.supabase.co" },
      { hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
