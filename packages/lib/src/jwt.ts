// An implementation of JSON Web Tokens.
// More at: https://github.com/auth0/node-jsonwebtoken

import type { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'

import { sign, verify } from 'jsonwebtoken'
import Result from '@pandora/lib/Result'

type Payload = Record<string, boolean | number | string>

export type SignSettings = {
  secret: string
  issuer: string
  audience: string
  expiresIn: number
}

export type VerifySettings = {
  secret: string
  issuer: string
  audience: string
}

export const JWT_SIGN_FAILED = 'JWT_SIGN_FAILED'
export const JWT_VERIFY_FAILED = 'JWT_VERIFY_FAILED'

const defaults = {
  secret: process.env.JWT_SECRET as string,
  issuer: process.env.JWT_ISSUER as string,
  audience: process.env.JWT_AUDIENCE as string,
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN_SECONDS || '60'),
}

const jwt = {
  async sign<T extends Payload>(payload: T, settings: SignSettings = defaults): Promise<Result<string>> {
    return new Promise((resolve) => {
      const options: SignOptions = {
        issuer: settings.issuer,
        audience: settings.audience,
        expiresIn: settings.expiresIn,
        algorithm: 'RS256',
      }

      sign(payload, settings.secret, options, (error, token) => {
        if (error) {
          resolve(Result.fail(JWT_SIGN_FAILED, { message: error.message }))
        } else if (!token) {
          resolve(Result.fail(JWT_SIGN_FAILED, { message: 'unable to sign token' }))
        } else {
          resolve(Result.success(token))
        }
      })
    })
  },
  async verify<T extends Payload>(token: string, settings: VerifySettings = defaults): Promise<Result<JwtPayload & T>> {
    return new Promise((resolve) => {
      const options: VerifyOptions = {
        issuer: settings.issuer,
        audience: settings.audience,
        algorithms: ['RS256'],
      }

      verify(token, settings.secret, options, (error, decoded) => {
        if (error) {
          resolve(Result.fail(JWT_VERIFY_FAILED, { message: error.message }))
        } else if (!decoded) {
          resolve(Result.fail(JWT_VERIFY_FAILED, { message: 'unable to decode token' }))
        } else {
          resolve(Result.success(decoded as JwtPayload & T))
        }
      })
    })
  },
}

export async function authorize<T extends Payload>(
  request: Request,
  settings: VerifySettings = defaults,
): Promise<Result<JwtPayload & T>> {
  const authorization = request.headers.get('authorization')
  const [type, token] = authorization ? authorization.split(' ') : []

  if (type?.toLowerCase() !== 'bearer' || !token) {
    return Result.fail(JWT_VERIFY_FAILED)
  }

  return await jwt.verify<T>(token, settings)
}

export default jwt
