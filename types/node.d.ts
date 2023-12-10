//
// NodeJS

declare namespace NodeJS {
  interface ProcessEnv {
    // Node.js
    readonly NODE_ENV: 'development' | 'production' | 'test'
    // Next.js
    readonly PUBLIC_URL: string
    // Cache
    readonly CACHE_TYPE: 'memory'
    // JWT
    readonly JWT_EXPIRES_IN_SECONDS: string
    readonly JWT_ISSUER: string
    readonly JWT_AUDIENCE: string
    readonly JWT_SECRET: string
  }
}