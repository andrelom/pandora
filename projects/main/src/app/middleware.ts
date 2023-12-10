import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

export const config = {
  matcher: '/:path*',
}

export function middleware(request: NextRequest) {
  return NextResponse.next()
}
