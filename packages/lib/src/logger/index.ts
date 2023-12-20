export type Logger = {
  info(msg: string): void
  warn(msg: string): void
  error(msg: string, obj?: any): void
}

export async function createLogger(): Promise<Logger> {
  if (typeof window === 'undefined') {
    return require('@pandora/lib/logger/server').default
  } else {
    return require('@pandora/lib/logger/client').default
  }
}
