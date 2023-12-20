import { webcrypto } from 'crypto'

export default class Result<T = any> {
  ok: boolean
  trace: string
  data?: T
  error?: string
  metadata?: Record<string, any>

  constructor(ok: boolean) {
    this.ok = ok
    this.trace = webcrypto.randomUUID()
  }

  static is(source: any): boolean {
    if (typeof source?.ok !== 'boolean') return false

    const allowed = ['ok', 'trace', 'data', 'error', 'metadata']
    const keys = Object.keys(source)
    const extra = keys.filter((key) => !allowed.includes(key))

    if (extra.length > 0) return false

    return true
  }

  static success<T>(data?: T): Result<T> {
    const result = new Result<T>(true)

    result.data = data

    return result
  }

  static fail<T>(error: string, metadata?: Record<string, any>): Result<T> {
    const result = new Result<T>(false)

    result.error = error
    result.metadata = metadata

    return result
  }

  static from<T>(source: Record<string, any>, data: boolean = false): Result<T> {
    const result = new Result<T>(source.ok)

    if (data) {
      result.data = source.data
    }

    result.trace = source.trace
    result.error = source.error
    result.metadata = source.metadata

    return result
  }
}
