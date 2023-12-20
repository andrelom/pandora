import type { Stage } from '.'

import { createURL } from '@pandora/lib/url'
import http from '@pandora/lib/http'
import api from '@pandora/lib/api'

const routes = new Set(process.env.AUTHORIZATION_ROUTES)

const authorize: Stage = async (request) => {
  const source = request.nextUrl.pathname.toLowerCase()

  if (!routes.has(source)) return api.getOk()

  const url = createURL('/api/middleware/authorize')
  const data = {}

  const result = await http.post(url, data, {
    headers: request.headers,
  })

  if (result.ok) return api.getOk()

  return api.getNotAuthorized()
}

export default authorize
