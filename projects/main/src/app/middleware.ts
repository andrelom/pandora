import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import logger from '@pandora/lib/logger/server'
import jwt from '@pandora/lib/jwt'
import api from '@pandora/lib/api'

async function authorize(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!pathname.startsWith('/api')) return

  const authorization = await jwt.authorize<{ pathname: string }>(request)

  if (authorization.data?.pathname === pathname) return

  logger.error('Middleware Authorize', authorization)

  return api.getNotAuthorized({
    trace: authorization.trace,
  })
}

export const config = {
  matcher: '/:path*',
}

export async function middleware(request: NextRequest) {
  const authorization = await authorize(request)

  if (authorization) return authorization

  return NextResponse.next()
}
