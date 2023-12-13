import type Result from '@pandora/lib/Result'

import pino from 'pino'

if (typeof window !== 'undefined') {
  throw new Error(
    `The 'lib/logger/server' is not compatible with the browser, please use the 'lib/logger/client' instead`,
  )
}

// Pino is a structured logging package.
// See more at: https://getpino.io/#/docs/api
const raw = pino({
  name: 'Pandora',
  level: process.env.LOGGER_LEVEL ?? 'info',
})

const server = {
  info: (message: string) => raw.info(message),
  warn: (message: string) => raw.warn(message),
  error: (message: string, result?: Result) => raw.error({ result }, message),
}

export default server