/** @type {import('next').NextConfig} */
// TODO: Configure Next.js application
// Set up Next.js config with:
// - Experimental features (serverActions, etc.)
// - Image domains configuration
// - Any other Next.js specific settings

const nextConfig = {
  // TODO: Configure experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // TODO: Configure image domains
  images: {
    domains: [],
  },
}

module.exports = nextConfig
