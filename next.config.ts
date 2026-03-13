import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // Security headers are applied by src/proxy.ts (middleware).
  // Avoid duplicating CSP here to prevent the weaker 'unsafe-eval' override.
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Output configuration for deployment
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

export default nextConfig;
