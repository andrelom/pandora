import { NextResponse } from 'next/server'
import Result from '@pandora/lib/Result'
import logger from '@pandora/lib/logger/server'

import { HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED } from '@pandora/lib/http-status-codes'

const api = {
  getOk<T = any>(data?: T): NextResponse<Result<T>> {
    return NextResponse.json(Result.success(data), { status: 200 })
  },
  getBadRequest(metadata?: Record<string, any>): NextResponse<Result> {
    return NextResponse.json(Result.fail(HTTP_400_BAD_REQUEST, metadata), { status: 400 })
  },
  getNotAuthorized(metadata?: Record<string, any>): NextResponse<Result> {
    return NextResponse.json(Result.fail(HTTP_401_UNAUTHORIZED, metadata), { status: 401 })
  },
}

export async function parse<T = any>(request: Request, fallback?: T): Promise<T | undefined> {
  try {
    return await request.json()
  } catch (error) {
    logger.error('API Request Parse', error)

    return fallback
  }
}

export default api
