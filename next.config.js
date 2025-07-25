/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Type checking during build
    ignoreBuildErrors: false,
  },
  eslint: {
    // ESLint checking during build
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Ignore optional dependencies that cause warnings with Supabase
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "bufferutil": false,
      "utf-8-validate": false
    };

    // Suppress warnings about critical dependencies
    config.ignoreWarnings = [
      { module: /node_modules/ },
    ];

    return config;
  },
}

module.exports = nextConfig
