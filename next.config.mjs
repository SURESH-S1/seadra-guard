/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Use in-memory cache during development on Windows to prevent
      // PackFileCacheStrategy ENOENT / atomic rename race conditions (0.pack.gz_ -> 0.pack.gz)
      config.cache = {
        type: 'memory',
      };
    }
    return config;
  },
};

export default nextConfig;

