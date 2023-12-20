import { webcrypto } from 'crypto'
import { createRouteProxy } from '@pandora/lib/proxy'

const proxy = createRouteProxy({
  target: 'https://example',
  rewrite: {
    '/api/proxy/example': '/v1',
  },
  async middleware(request) {
    request.headers.set('Authorization', `Bearer ${webcrypto.randomUUID()}`)
  },
})

export async function GET(request: Request) {
  return await proxy(request)
}

export async function POST(request: Request) {
  return await proxy(request)
}

export async function PUT(request: Request) {
  return await proxy(request)
}

export async function DELETE(request: Request) {
  return await proxy(request)
}
