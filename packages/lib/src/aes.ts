// In Authenticated AES in GCM mode, the AES algorithm is used for encryption and
// decryption, while GCM handles the authentication and integrity-checking
// aspects. The algorithm takes as input a secret key, a nonce (number used once),
// plaintext data, and optional associated data. It outputs the ciphertext and an
// authentication tag.

import * as crypto from 'crypto'
import Result from '@pandora/lib/Result'

export const AES_ENCODE_FAILED = 'AES_ENCODE_FAILED'

export const AES_DECODE_FAILED = 'AES_DECODE_FAILED'

export class AES {
  private key: Buffer

  constructor(key: string) {
    this.key = crypto.createHash('sha256').update(String(key)).digest()
  }

  encode(data: Record<string, string>): Result<string> {
    try {
      const iv = crypto.randomBytes(16)
      const serialized = this.serialize(data)
      const { encrypted, tag } = this.encrypt(serialized, iv)
      const encoded = this.format(iv, tag, encrypted)

      return Result.success(encoded)
    } catch (error: any) {
      return Result.fail(AES_ENCODE_FAILED, { message: error.message })
    }
  }

  decode(cookie: string): Result<Record<string, string>> {
    try {
      const [ivBase64, tagBase64, encryptedBase64] = cookie.split(':')

      const iv = Buffer.from(ivBase64, 'base64')
      const tag = Buffer.from(tagBase64, 'base64')
      const encrypted = Buffer.from(encryptedBase64, 'base64')

      const decrypted = this.decrypt(encrypted, iv, tag)
      const decoded = this.parse(decrypted)

      return Result.success(decoded)
    } catch (error: any) {
      return Result.fail(AES_DECODE_FAILED, { message: error.message })
    }
  }

  private format(iv: Buffer, tag: string, encrypted: string): string {
    return `${iv.toString('base64')}:${tag}:${encrypted}`
  }

  private encrypt(data: string, iv: Buffer): { encrypted: string; tag: string } {
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv)

    let encrypted = cipher.update(data, 'utf8', 'base64')

    encrypted += cipher.final('base64')

    const tag = cipher.getAuthTag().toString('base64')

    return { encrypted, tag }
  }

  private decrypt(encrypted: Buffer, iv: Buffer, tag: Buffer): string {
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv)

    decipher.setAuthTag(tag)

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

    return decrypted.toString('utf8')
  }

  private serialize(data: Record<string, string>): string {
    const builder = new URLSearchParams()
    const entries = Object.entries(data)

    for (const [key, value] of entries) {
      builder.append(key, value)
    }

    return decodeURIComponent(builder.toString())
  }

  private parse(encoded: string): Record<string, string> {
    const builder = new URLSearchParams(encoded)
    const entries: any = builder.entries()

    const data: Record<string, string> = {}

    for (const [key, value] of entries) {
      data[key] = value
    }

    return data
  }
}

const aes = new AES(process.env.AES_SECRET_KEY)

export default aes
