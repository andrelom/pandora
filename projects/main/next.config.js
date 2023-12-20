const DefineRoutesPlugin = require('../../webpack/DefineRoutesPlugin')

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
      config.plugins.push(new DefineRoutesPlugin('internal'))
      config.plugins.push(new DefineRoutesPlugin('authorization'))
    }

    return config
  },
}

module.exports = nextConfig
