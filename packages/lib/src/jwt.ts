// An implementation of JSON Web Tokens.
// More at: https://github.com/auth0/node-jsonwebtoken

if (typeof window !== 'undefined') {
  throw new Error(`the 'lib/jwt' is not compatible with the browser`)
}

import type { Algorithm } from 'jsonwebtoken'

import { sign, verify } from 'jsonwebtoken'
import Result from '@pandora/lib/Result'

export type JWTOptions = {
  algorithm: Algorithm
  secret: string
  issuer: string
  audience: string
  expiresIn: number
}

export type JWTData = {
  [key: string]: boolean | number | string
}

export type JWTPayload<T = JWTData> = T & {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  iat?: number
  jti?: string
}

export const JWT_SIGN_FAILED = 'JWT_SIGN_FAILED'

export const JWT_VERIFY_FAILED = 'JWT_VERIFY_FAILED'

export class JWT {
  private options: JWTOptions

  constructor(options: JWTOptions) {
    this.options = options
  }

  async sign<T extends JWTData>(data: T): Promise<Result<string>> {
    return new Promise((resolve) => {
      const options = {
        issuer: this.options.issuer,
        audience: this.options.audience,
        algorithm: this.options.algorithm,
        expiresIn: this.options.expiresIn,
      }

      sign(data, this.options.secret, options, (error, token) => {
        if (error) {
          resolve(Result.fail(JWT_SIGN_FAILED, { message: error.message }))
        } else if (!token) {
          resolve(Result.fail(JWT_SIGN_FAILED, { message: 'unable to sign token' }))
        } else {
          resolve(Result.success(token))
        }
      })
    })
  }

  async verify<T extends JWTData>(token: string): Promise<Result<JWTPayload<T>>> {
    return new Promise((resolve) => {
      const options = {
        issuer: this.options.issuer,
        audience: this.options.audience,
        algorithms: [this.options.algorithm],
      }

      verify(token, this.options.secret, options, (error, decoded) => {
        if (error) {
          resolve(Result.fail(JWT_VERIFY_FAILED, { message: error.message }))
        } else if (!decoded) {
          resolve(Result.fail(JWT_VERIFY_FAILED, { message: 'unable to decode token' }))
        } else {
          resolve(Result.success(decoded as JWTPayload<T>))
        }
      })
    })
  }

  async authorize<T extends JWTData>(request: Request): Promise<Result<JWTPayload<T>>> {
    const authorization = request.headers.get('authorization')
    const [type, token] = authorization ? authorization.split(' ') : []

    if (type?.toLowerCase() !== 'bearer' || !token) {
      return Result.fail(JWT_VERIFY_FAILED)
    }

    return await jwt.verify<T>(token)
  }
}

const jwt = new JWT({
  algorithm: process.env.JWT_ALGORITHM as Algorithm,
  secret: process.env.JWT_SECRET_KEY,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  expiresIn: parseInt(process.env.JWT_EXPIRES_SECONDS),
})

export default jwt
