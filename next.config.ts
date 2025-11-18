import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '**',
      },
    ],
  },

  // distDir: process.env.NODE_ENV === 'production' || process.env.CI
  //     ? '.next-build'
  //     : '.next-dev',

};

export default nextConfig;


// import type { NextConfig } from 'next'
//
// const nextConfig: NextConfig = {
//   output: 'export',
// }
//
// export default nextConfig
