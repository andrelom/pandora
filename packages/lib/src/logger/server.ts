if (typeof window !== 'undefined') {
  throw new Error(`the 'lib/logger/server' is not compatible with the browser`)
}

import type { Logger } from './'

import pino from 'pino'

// Pino is a structured logging package.
// See more at: https://getpino.io/#/docs/api
const raw = pino({
  name: 'Pandora',
  level: process.env.LOGGER_LEVEL ?? 'info',
})

const server: Logger = {
  info: (msg: string) => raw.info(msg),
  warn: (msg: string) => raw.warn(msg),
  error: (msg: string, obj?: any) => raw.error({ obj }, msg),
}

export default server
