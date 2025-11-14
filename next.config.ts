import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'queekapp-files.s3.us-east-1.amazonaws.com',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'queekapp-files.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'csc.test',
        pathname: '/**',
      },
    ],
  },

  distDir: process.env.NODE_ENV === 'production' || process.env.CI
      ? '.next'
      : '.next-dev',

};

export default nextConfig;
