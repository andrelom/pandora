import { isNil } from '@pandora/lib/objects'

export interface Cache {
  get<T = any>(key: string): Promise<T | null>
  set<T = any>(key: string, value: T, expiration: number): Promise<void>
  delete(key: string): Promise<void>
  clear(prefix: string): Promise<void>
}

export class MemoryCache implements Cache {
  private name: string
  private memory: Map<string, any>

  constructor(name: string) {
    this.name = name
    this.memory = new Map()

    if (process.env.NODE_ENV !== 'development') {
      console.warn('In Memory Cache: Please use this for development only')
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const id = this.getId(key)
    const value = this.memory.get(id)

    if (isNil(value)) return null

    return value as T
  }

  async set<T = any>(key: string, value: T, expiration: number = 60): Promise<void> {
    if (isNil(value)) return

    const id = this.getId(key)

    this.memory.set(id, value)

    setTimeout(() => this?.memory?.delete(id), expiration)
  }

  async delete(key: string): Promise<void> {
    this.memory.delete(this.getId(key))
  }

  async clear(prefix: string): Promise<void> {
    const keys = this.memory.keys() as unknown as Array<string>

    for (const key of keys) {
      if (key.startsWith(this.getId(prefix))) {
        this.memory.delete(key)
      }
    }
  }

  private getId(key: string) {
    return `${this.name}#${key}`.toLowerCase()
  }
}

export function createCache(name: string): Cache {
  const type = process.env.CACHE_TYPE

  switch (type) {
    case 'memory':
      return new MemoryCache(name)
    default:
      throw new Error(`invalid cache type (${type})`)
  }
}

const cache = createCache('cache')

export default cache
