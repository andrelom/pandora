import type { Stage } from '.'

import api from '@pandora/lib/api'

const routes = new Set(process.env.INTERNAL_ROUTES)

const authorize: Stage = async (request) => {
  const source = request.nextUrl.pathname.toLowerCase()

  if (!routes.has(source)) null

  const secret = request.headers.get('x-internal-secret')

  if (secret === process.env.INTERNAL_SECRET) return null

  return api.getNotAuthorized()
}

export default authorize
