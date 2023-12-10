// An implementation of JSON Web Tokens.
// More at: https://github.com/auth0/node-jsonwebtoken

import type { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'

import { sign, verify } from 'jsonwebtoken'
import Result from '@pandora/lib/Result'

export type JwtData = Record<string, boolean | number | string>

export type JwtSignSettings = {
  secret: string
  issuer: string
  audience: string
  expiresIn: number
}

export type JwtVerifySettings = {
  secret: string
  issuer: string
  audience: string
}

export const JWT_SIGN_FAILED = 'JWT_SIGN_FAILED'

export const JWT_VERIFY_FAILED = 'JWT_VERIFY_FAILED'

export class Jwt {
  private settings: JwtSignSettings

  constructor(settings: JwtSignSettings) {
    this.settings = settings
  }

  async sign<T extends JwtData>(data: T): Promise<Result<string>> {
    return new Promise((resolve) => {
      const options: SignOptions = {
        issuer: this.settings.issuer,
        audience: this.settings.audience,
        expiresIn: this.settings.expiresIn,
        algorithm: 'RS256',
      }

      sign(data, this.settings.secret, options, (error, token) => {
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
        issuer: this.settings.issuer,
        audience: this.settings.audience,
        algorithms: ['RS256'],
      }

      verify(token, this.settings.secret, options, (error, decoded) => {
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
  secret: process.env.JWT_SECRET as string,
  issuer: process.env.JWT_ISSUER as string,
  audience: process.env.JWT_AUDIENCE as string,
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN_SECONDS || '60'),
})

export default jwt
