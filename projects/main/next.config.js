const GetProtectedRoutesPlugin = require('../../webpack/GetProtectedRoutesPlugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  env: {
    PUBLIC_URL: process.env.PUBLIC_URL,
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(new GetProtectedRoutesPlugin({}))

    return config
  },
}

module.exports = nextConfig
