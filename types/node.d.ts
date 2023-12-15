//
// NodeJS

declare namespace NodeJS {
  interface ProcessEnv {
    // Node.js
    readonly NODE_ENV: 'development' | 'production' | 'test'
    // Next.js
    readonly PUBLIC_URL: string
    // Logger
    readonly LOGGER_LEVEL: string
    // Cache
    readonly CACHE_TYPE: 'memory' | 'redis'
    // JWT
    readonly JWT_ALGORITHM: string
    readonly JWT_ISSUER: string
    readonly JWT_AUDIENCE: string
    readonly JWT_SECRET_KEY: string
    readonly JWT_EXPIRES_SECONDS: string
    // AES
    readonly AES_SECRET_KEY: string
  }
}
