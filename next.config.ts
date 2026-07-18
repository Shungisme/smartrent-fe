import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    // Admin is an internal review tool, not the SEO/perf-critical public
    // site — skip Vercel's paid Image Optimization API entirely so listing
    // photos always render straight from their origin (R2/CDN) instead of
    // occasionally 402ing ("Payment Required") once the account's optimized-
    // image quota for the month is used up.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**.localhost',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
