// An implementation of JSON Web Tokens.
// More at: https://github.com/auth0/node-jsonwebtoken

import type { Algorithm, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'

import { sign, verify } from 'jsonwebtoken'
import Result from '@pandora/lib/Result'

export type JwtData = Record<string, boolean | number | string>

export type JwtOptions = {
  algorithm: Algorithm
  secret: string
  issuer: string
  audience: string
  expiresIn: number
}

export const JWT_SIGN_FAILED = 'JWT_SIGN_FAILED'

export const JWT_VERIFY_FAILED = 'JWT_VERIFY_FAILED'

export class Jwt {
  private options: JwtOptions

  constructor(options: JwtOptions) {
    this.options = options
  }

  async sign<T extends JwtData>(data: T): Promise<Result<string>> {
    return new Promise((resolve) => {
      const options: SignOptions = {
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

  async verify<T extends JwtData>(token: string): Promise<Result<JwtPayload & T>> {
    return new Promise((resolve) => {
      const options: VerifyOptions = {
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
          resolve(Result.success(decoded as JwtPayload & T))
        }
      })
    })
  }

  async authorize<T extends JwtData>(request: Request): Promise<Result<JwtPayload & T>> {
    const authorization = request.headers.get('authorization')
    const [type, token] = authorization ? authorization.split(' ') : []

    if (type?.toLowerCase() !== 'bearer' || !token) {
      return Result.fail(JWT_VERIFY_FAILED)
    }

    return await jwt.verify<T>(token)
  }
}

const jwt = new Jwt({
  algorithm: process.env.JWT_ALGORITHM as Algorithm,
  secret: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  expiresIn: parseInt(process.env.JWT_EXPIRES_SECONDS),
})

export default jwt
