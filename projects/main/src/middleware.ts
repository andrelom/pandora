import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import pipeline from '@/pipeline'

export const config = {
  matcher: '/:path*',
}

export async function middleware(request: NextRequest) {
  for (const stage of pipeline) {
    const response = await stage(request)

    if (!response) continue

    return response
  }

  return NextResponse.next()
}
