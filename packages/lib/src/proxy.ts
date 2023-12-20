if (typeof window !== 'undefined') {
  throw new Error(`the 'lib/proxy' is not compatible with the browser`)
}

import { NextResponse } from 'next/server'

export interface RequestProxyOptions {
  target: string
  rewrite: Record<string, string>
}

export interface RouteProxyOptions extends RequestProxyOptions {
  mapping?: string[]
  middleware?: (request: Request) => Promise<void>
}

// Bypass certificate validation.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const defaults = {
  mapping: ['content-type'],
}

const rewrite = (source: string, target: Record<string, string>): string => {
  return Object.entries(target).reduce((pathname, [key, value]) => pathname.replace(key, value), source)
}

const transfer = (response: Response, route: NextResponse, allowed: string[]) => {
  response.headers.forEach((value, key) => {
    if (allowed.includes(key)) {
      route.headers.set(key, value)
    }
  })
}

export async function createRequestProxy(request: Request, options: RequestProxyOptions): Promise<Request> {
  const source = new URL(request.url)
  const pathname = rewrite(source.pathname, options.rewrite)

  const url = new URL(`${pathname}${source.search}`, options.target)
  const proxy = new Request(url, request)

  proxy.headers.set('host', url.host)

  return proxy
}

export function createRouteProxy(options: RouteProxyOptions): (request: Request) => Promise<NextResponse> {
  return async (request: Request) => {
    const proxy = await createRequestProxy(request, options)

    if (options.middleware) {
      await options.middleware(proxy)
    }

    const response = await fetch(proxy)
    const body = await response.text()

    const route = new NextResponse(body, { status: response.status })
    const allowed = options.mapping ?? defaults.mapping

    transfer(response, route, allowed)

    return route
  }
}
