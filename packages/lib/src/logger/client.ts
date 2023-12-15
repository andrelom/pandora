import type { Logger } from './'

const cli = typeof window !== 'undefined'
const dev = process.env.NODE_ENV !== 'production'

const client: Logger = {
  info: (msg: string) => cli && dev && console.info(msg),
  warn: (msg: string) => cli && dev && console.warn(msg),
  error: (msg: string, obj?: any) => cli && dev && console.error({ obj }, msg),
}

export default client
