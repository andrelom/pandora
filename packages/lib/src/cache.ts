import type { RedisClientType, RedisClientOptions } from 'redis'

import { createClient } from 'redis'
import { isNil } from '@pandora/lib/objects'

export interface Cache {
  get<T = any>(key: string): Promise<T | null>
  set<T = any>(key: string, value: T, expiration: number): Promise<void>
  delete(key: string): Promise<void>
  clear(prefix?: string): Promise<void>
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

  async clear(prefix: string = ''): Promise<void> {
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

export class RedisCache implements Cache {
  private name: string
  private memory: Map<string, any>
  private redis: RedisClientType

  constructor(name: string, options?: RedisClientOptions) {
    this.name = name
    this.memory = new Map()
    this.redis = createClient(options) as RedisClientType
  }

  async get<T = any>(key: string): Promise<T | null> {
    const id = this.getId(key)
    const memory = this.memory.get(id)

    if (!isNil(memory)) return memory as T

    const value = await this.redis.get(id)

    if (isNil(value)) return null

    this.memorize(id, value)

    return JSON.parse(value as string) as T
  }

  async set<T = any>(key: string, value: T, expiration: number = 1800): Promise<void> {
    if (isNil(value)) return

    const id = this.getId(key)

    await this.redis.set(id, JSON.stringify(value))
    await this.redis.expire(id, expiration)

    this.memorize(id, value)
  }

  async delete(key: string): Promise<void> {
    const id = this.getId(key)

    await this.redis.del(id)

    this.memory.delete(id)
  }

  async clear(prefix: string = ''): Promise<void> {
    const keys = await this.redis.keys('*')

    for (const key of keys) {
      if (key.startsWith(this.getId(prefix))) {
        await this.redis.del(key)

        this.memory.delete(key)
      }
    }
  }

  private getId(key: string) {
    return `${this.name}#${key}`.toLowerCase()
  }

  // Debounce the cache reading routine.
  // If requests are made within five seconds, the cache will be fresh in memory, if
  // this time exceeds, we delete it, and we fetch the value from Redis.
  private memorize<T = any>(id: string, value: T) {
    if (isNil(value)) return

    this.memory.set(id, value)

    setTimeout(() => this?.memory?.delete(id), 5 * 1000)
  }
}

export function createCache(name: string): Cache {
  const type = process.env.CACHE_TYPE

  switch (type) {
    case 'memory':
      return new MemoryCache(name)
    case 'redis':
      return new RedisCache(name)
    default:
      throw new Error(`invalid cache type (${type})`)
  }
}

const cache = createCache('cache')

export default cache
