import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: [
      '@tabler/icons-react',
      'motion',
      'sonner',
      '@clerk/nextjs',
      'clsx',
      'tailwind-merge',
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "none-jfj",
  project: "vaulty-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Disable wider client file upload to minimize build time and peak memory usage on low-resource EC2 instances
  widenClientFileUpload: false,

  // Disable sourcemap uploading when no auth token is provided
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      removeDebugLogging: true,
    },
  },
});

