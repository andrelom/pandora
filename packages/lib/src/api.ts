import { NextResponse } from 'next/server'
import Result from '@pandora/lib/Result'

import { HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED } from '@pandora/lib/http-status-codes'

const api = {
  getOk<T = any>(data?: T) {
    return NextResponse.json(Result.success(data), { status: 200 })
  },
  getBadRequest(metadata?: Record<string, any>) {
    return NextResponse.json(Result.fail(HTTP_400_BAD_REQUEST, metadata), { status: 400 })
  },
  getNotAuthorized(metadata?: Record<string, any>) {
    return NextResponse.json(Result.fail(HTTP_401_UNAUTHORIZED, metadata), { status: 401 })
  },
}

export async function parse<T = any>(request: Request): Promise<T | undefined> {
  try {
    return await request.json()
  } catch {
    return
  }
}

export default api
