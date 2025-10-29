import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  distDir: process.env.NODE_ENV === 'production' || process.env.CI
      ? '.next'
      : '.next-dev',

};

export default nextConfig;
