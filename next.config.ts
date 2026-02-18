import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Vercel deployment
  output: "export",
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Strict mode for better development experience
  reactStrictMode: true,
};

export default nextConfig;
