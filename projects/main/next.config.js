/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  env: {
    PUBLIC_URL: process.env.PUBLIC_URL,
  },
}

module.exports = nextConfig
