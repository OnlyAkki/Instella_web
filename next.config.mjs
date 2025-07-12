/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enables experimental APIs like forbidden() and unauthorized() for Next.js 15.1 [^1]
    authInterrupts: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
