/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true, // Required for static export
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  // GitHub Pages specific config
  basePath: process.env.NODE_ENV === 'production' ? 'abcal.github.io/' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/abcal/' : '',
}

module.exports = nextConfig
