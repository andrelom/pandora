export default class Result<T = any> {
  ok: boolean
  data?: T
  error?: string
  metadata?: Record<string, any>

  constructor(ok: boolean) {
    this.ok = ok
  }

  static is(source: any): boolean {
    if (!('ok' in source) || typeof source.ok !== 'boolean') return false

    const allowed = ['ok', 'data', 'error', 'metadata']
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

    result.error = source.error
    result.metadata = source.metadata

    return result
  }
}
