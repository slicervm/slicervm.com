import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Only apply basePath when deploying to GitHub Pages WITHOUT custom domain
  // For custom domains like slicervm.com, basePath should NOT be used
  ...(process.env.GITHUB_PAGES === "true" &&
    !process.env.GITHUB_PAGES_CUSTOM_DOMAIN && {
      basePath: "/slicervm.com",
    }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
