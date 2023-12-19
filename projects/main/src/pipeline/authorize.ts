import type { NextRequest, NextResponse } from 'next/server'

import logger from '@pandora/lib/logger/server'
import jwt from '@pandora/lib/jwt'
import api from '@pandora/lib/api'

export default async function authorize(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname

  if (!pathname.startsWith('/api')) return null

  const result = await jwt.authorize<{ pathname: string }>(request)

  if (result.data?.pathname === pathname) return null

  logger.error('Middleware Authorize', result)

  return api.getNotAuthorized({
    trace: result.trace,
  })
}
