const DefineAuthorizationRoutesPlugin = require('../../webpack/DefineAuthorizationRoutesPlugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  env: {
    PUBLIC_URL: process.env.PUBLIC_URL,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(new DefineAuthorizationRoutesPlugin())
    }

    return config
  },
}

module.exports = nextConfig
