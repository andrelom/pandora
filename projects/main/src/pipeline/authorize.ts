import type { NextRequest, NextResponse } from 'next/server'

import logger from '@pandora/lib/logger/server'
import jwt from '@pandora/lib/jwt'
import api from '@pandora/lib/api'

export default async function authorize(request: NextRequest): Promise<NextResponse | null> {
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
