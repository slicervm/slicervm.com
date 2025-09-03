import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/slicervm.com',
  }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
