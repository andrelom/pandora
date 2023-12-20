'use internal'

import logger from '@pandora/lib/logger/server'
import jwt from '@pandora/lib/jwt'
import api from '@pandora/lib/api'

export async function POST(request: Request) {
  const url = new URL(request.url)
  const source = url.pathname.toLowerCase()

  const result = await jwt.authorize<{ pathname: string }>(request)
  const target = result.data?.pathname.toLowerCase()

  if (source === target) return api.getOk()

  logger.error('Middleware Authorize', result)

  return api.getNotAuthorized({
    trace: result.trace,
  })
}
