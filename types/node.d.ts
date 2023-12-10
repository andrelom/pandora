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
    readonly JWT_ALGORITHM: string
    readonly JWT_ISSUER: string
    readonly JWT_AUDIENCE: string
    readonly JWT_SECRET: string
    readonly JWT_EXPIRES_SECONDS: string
    // Identity
    readonly IDENTITY_SESSION_EXPIRES_SECONDS: string
  }
}
