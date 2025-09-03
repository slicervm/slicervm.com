import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  // Only apply basePath when deploying to GitHub Pages
  ...(process.env.GITHUB_PAGES === 'true' && {
    basePath: '/slicervm.com',
  }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
