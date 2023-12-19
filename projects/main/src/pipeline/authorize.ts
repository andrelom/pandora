import logger from '@pandora/lib/logger/server'
import jwt from '@pandora/lib/jwt'
import api from '@pandora/lib/api'

const authorize: Core.Stage = async (request) => {
  const source = request.nextUrl.pathname.toLowerCase()

  if (!source.startsWith('/api')) return null

  const result = await jwt.authorize<{ pathname: string }>(request)
  const target = result.data?.pathname.toLowerCase()

  if (source === target) return null

  logger.error('Middleware Authorize', result)

  return api.getNotAuthorized({
    trace: result.trace,
  })
}

export default authorize
