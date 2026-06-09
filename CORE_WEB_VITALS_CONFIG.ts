// next.config.ts - Core Web Vitals Optimization

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Compression
  compress: true,

  // Generate ETags
  generateEtags: true,

  // Production source maps (disable for better performance)
  productionBrowserSourceMaps: false,

  // HEADERS for performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ],
      }
    ];
  },

  // REWRITES for optimization
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap'
        }
      ]
    };
  },

  // Webpack configuration for optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              filename: 'vendor.js',
              chunks: 'all',
              test: /node_modules/,
              priority: 10,
            },
            common: {
              filename: 'common.js',
              minChunks: 2,
              priority: 5,
            }
          },
        },
      };
    }
    return config;
  },

  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      '@vercel/analytics',
      '@vercel/speed-insights'
    ],
  },

  // Timeouts
  staticPageGenerationTimeout: 300,
};

module.exports = nextConfig;
