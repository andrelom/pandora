export type Logger = {
  info(msg: string): void
  warn(msg: string): void
  error(msg: string, obj?: any): void
}

export async function createLogger(): Promise<Logger> {
  if (typeof window === 'undefined') {
    return await require('@pandora/lib/logger/server').then((server: any) => server.default)
  } else {
    return await require('@pandora/lib/logger/client').then((client: any) => client.default)
  }
}
