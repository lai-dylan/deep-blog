/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/deep-blog',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
